<?php

namespace App\Repositories\Contracts;

use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface MessageRepositoryInterface extends BaseRepositoryInterface
{
    public function getUnread(): Collection;

    public function paginateWithFilters(bool $unreadOnly = false, int $perPage = 20): LengthAwarePaginator;

    public function paginateWithFiltersAndSearch(?bool $unreadOnly = false, ?string $search = null, int $perPage = 20): LengthAwarePaginator;

    public function markAsRead(int $messageId): void;

    public function getLastMessageByUser(int $userId);
}