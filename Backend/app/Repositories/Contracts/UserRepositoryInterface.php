<?php

namespace App\Repositories\Contracts;

interface UserRepositoryInterface extends BaseRepositoryInterface
{
    public function findByEmail(string $email): ?\App\Models\User;

    public function createVisitor(array $data): \App\Models\User;
}