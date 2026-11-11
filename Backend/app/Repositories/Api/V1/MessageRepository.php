<?php

namespace App\Repositories\Api\V1;

use App\Models\Message;
use App\Repositories\BaseRepository;
use App\Repositories\Contracts\MessageRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class MessageRepository extends BaseRepository implements MessageRepositoryInterface
{
    public function __construct(Message $model)
    {
        parent::__construct($model);
    }

    public function getUnread(): Collection
    {
        return $this->model->unread()->latest()->get();
    }

    public function paginateWithFilters(bool $unreadOnly = false, int $perPage = 20): LengthAwarePaginator
    {
        $query = $this->model->query();
        if ($unreadOnly) {
            $query->unread();
        }

        return $query->latest()->paginate($perPage);
    }

    public function paginateWithFiltersAndSearch(?bool $unreadOnly = false, ?string $search = null, int $perPage = 20): LengthAwarePaginator
    {
        $query = $this->model->query();

        if ($unreadOnly) {
            $query->unread();
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $pattern = "%{$search}%";
                $q->where('sender_name', 'ilike', $pattern)
                    ->orWhere('sender_email', 'ilike', $pattern)
                    ->orWhere('subject', 'ilike', $pattern)
                    ->orWhere('message', 'ilike', $pattern);
            });
        }

        return $query->latest()->paginate($perPage);
    }

    public function markAsRead(int $messageId): void
    {
        $this->model->where('id', $messageId)->update(['is_read' => true]);
    }

    public function getLastMessageByUser(int $userId)
    {
        return $this->model->where('user_id', $userId)->latest()->first();
    }
}
