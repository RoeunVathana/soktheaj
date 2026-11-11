<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'SOKTHEA CHHUM',
            'email' => 'sotheachhum2@gmail.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'avatar' => null,
            'avatars' => null,
        ]);

        // Create visitor users
        User::factory(10)->create([
            'role' => 'visitor',
        ]);
    }
}