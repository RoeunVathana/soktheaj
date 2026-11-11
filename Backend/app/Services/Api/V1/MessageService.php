<?php

namespace App\Services\Api\V1;

use App\Http\Resources\Api\V1\MessageResource;
use App\Mail\ContactMail;
use App\Repositories\Contracts\MessageRepositoryInterface;
use App\Services\Contracts\MessageServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class MessageService extends BaseService implements MessageServiceInterface
{
    private MessageRepositoryInterface $messageRepo;

    public function __construct(MessageRepositoryInterface $repository)
    {
        parent::__construct($repository);
        $this->messageRepo = $repository;
    }

    public function index(Request $request): JsonResponse
    {
        $search = $request->input('search');
        $perPage = $request->integer('per_page', 20);

        $messages = $this->messageRepo->paginateWithFiltersAndSearch(
            $request->boolean('unread'),
            $search,
            $perPage
        );
        return response()->json(MessageResource::collection($messages)->response()->getData(true));
    }

    public function store(array $data): JsonResponse
    {
        $user = Auth::user();

        // Require authentication
        if (!$user) {
            return response()->json([
                'message' => 'You must be logged in to send a message.',
            ], 401);
        }

        // Throttle: prevent spam - one message every 30 seconds per user
        $lastMessage = $this->messageRepo->getLastMessageByUser($user->id);
        if ($lastMessage && $lastMessage->last_sent_at) {
            $secondsSince = now()->diffInSeconds($lastMessage->last_sent_at);
            if ($secondsSince < 30) {
                return response()->json([
                    'message' => 'Please wait ' . (30 - $secondsSince) . ' seconds before sending another message.',
                ], 429);
            }
        }

        // Never accept user_id from form data - always use authenticated user
        unset($data['user_id']);
        $data['user_id'] = $user->id;
        $data['last_sent_at'] = now();

        $message = $this->messageRepo->create($data);

        // Send email notification to admin
        try {
            Mail::to(config('mail.from.address'))->send(new ContactMail($message));
        } catch (\Exception $e) {
            Log::error('Failed to send contact email notification: ' . $e->getMessage());
        }

        return $this->respondWithResource(MessageResource::class, $message, 'Your message has been sent successfully.', 201);
    }

    public function show($message): JsonResponse
    {
        return $this->respondWithResource(MessageResource::class, $message);
    }

    public function markAsRead($message): JsonResponse
    {
        $this->messageRepo->markAsRead($message->id);
        $message->refresh();
        return $this->respondWithResource(MessageResource::class, $message, 'Message marked as read');
    }

    public function reply($message, array $data): JsonResponse
    {
        $recipientEmail = $message->sender_email ?? $message->email;
        if (!$recipientEmail) {
            return response()->json([
                'success' => false,
                'message' => 'Recipient email not found.',
            ], 422);
        }

        try {
            Mail::raw($data['reply_message'], function ($mail) use ($recipientEmail, $data) {
                $mail->to($recipientEmail)
                     ->subject($data['subject']);
            });
        } catch (\Exception $e) {
            Log::error('Failed to send email reply: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to send email: ' . $e->getMessage(),
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Reply sent successfully',
        ]);
    }

    public function update($message, array $data): JsonResponse
    {
        $message = $this->messageRepo->update($message, $data);
        return $this->respondWithResource(MessageResource::class, $message, 'Message updated successfully');
    }

    public function destroy($message): JsonResponse
    {
        $this->messageRepo->delete($message);
        return $this->respondWithMessage('Message deleted successfully');
    }
}