<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\UserResource;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function __construct(protected UserRepositoryInterface $userRepository) {}

    public function index(): JsonResponse
    {
        $users = $this->userRepository->all();
        return response()->json([
            'message' => 'Users retrieved successfully',
            'users' => UserResource::collection($users),
        ]);
    }

    public function show(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (! $user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        return response()->json([
            'message' => 'User retrieved successfully',
            'user' => new UserResource($user),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|string|in:visitor,admin',
        ]);

        $user = $this->userRepository->createVisitor($validated);

        // Override role if provided
        if (isset($validated['role'])) {
            $user->update(['role' => $validated['role']]);
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user->fresh()),
        ], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (! $user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:8',
            'role' => 'sometimes|string|in:visitor,admin',
        ]);

        $data = $validated;

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => new UserResource($user->fresh()),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $user = $this->userRepository->find($id);

        if (! $user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // Prevent deleting yourself
        if (request()->user() && request()->user()->id === $user->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}