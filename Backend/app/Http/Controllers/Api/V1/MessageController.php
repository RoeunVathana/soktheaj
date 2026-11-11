<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMessageRequest;
use App\Models\Message;
use App\Services\Contracts\MessageServiceInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function __construct(protected MessageServiceInterface $messageService) {}

    public function index(Request $request): JsonResponse
    {
        return $this->messageService->index($request);
    }

    public function store(StoreMessageRequest $request): JsonResponse
    {
        return $this->messageService->store($request->validated());
    }

    public function show(Message $message): JsonResponse
    {
        return $this->messageService->show($message);
    }

    public function markAsRead(Message $message): JsonResponse
    {
        return $this->messageService->markAsRead($message);
    }

    public function reply(Request $request, Message $message): JsonResponse
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:255',
            'reply_message' => 'required|string',
        ]);

        return $this->messageService->reply($message, $validated);
    }

    public function destroy(Message $message): JsonResponse
    {
        return $this->messageService->destroy($message);
    }
}