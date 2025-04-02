<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Exception;

class UserController extends Controller
{
    public function getUser(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'first_name' => e($user->first_name),
                'last_name' => e($user->last_name),
                'email' => e($user->email),
                'image' => e($user->image),
                'phone'=>e($user->phone),
                'address'=>e($user->address),
            ]
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
            'new_password' => 'required|string|confirmed',
            'new_password_confirmation' => 'required|string',
        ]);

        $user = Auth::user();
        $currentPassword = $request->password;
        $newPassword = $request->new_password;

        if (Hash::check($currentPassword, $user->password)) {
            $user->password = Hash::make($newPassword);
            $user->save();

            return response()->json(['message' => 'Password updated successfully'], 200);
        }

        return response()->json(['error' => 'Current password is incorrect'], 422);
    }

    public function updateUser(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

        $validator = Validator::make($request->all(), [
            'first_name' => 'string|max:255|regex:/^[a-zA-Z\s]+$/',
            'last_name' => 'string|max:255|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update user data
        $user->first_name = strip_tags($request->input('first_name'));
        $user->last_name = strip_tags($request->input('last_name'));
        $user->email = strip_tags($request->input('email'));

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($user->image && file_exists(public_path($user->image))) {
                    unlink(public_path($user->image));
                }

            $image = $request->file('image');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $image->getClientOriginalExtension();
            
            // Store in public/images/userProfile
            $path = $image->move(public_path('images/userProfile'), $filename);
            
            // Save relative path in database
            $user->image = 'images/userProfile/' . $filename;
        }

            $user->save();

        return response()->json([
            'message' => 'User data updated successfully',
            'user' => [
                'first_name' => e($user->first_name),
                'last_name' => e($user->last_name),
                'email' => e($user->email),
                'image' => $user->image ? asset($user->image) : null,
            ]
        ], 200);
    } catch (Exception $e) {
        Log::error('Error updating user: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while updating user data'], 500);
    }
}

    public function deleteAccount(Request $request)
    {
        try {
            $user = $request->user();

            if (!Hash::check($request->input('password'), $user->password)) {
                return response()->json(['error' => 'Incorrect password'], 401);
            }

            $user->tokens()->delete();
            $user->delete();

            Log::info('User deleted account.', ['user_id' => $user->id]);

            return response()->json(['message' => 'Account deleted successfully'], 200);
        } catch (Exception $e) {
            Log::error('Error deleting account: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while deleting the account'], 500);
        }
    }
    public function getNotAdmittedUsers()
    {
        $users = \App\Models\User::where('user_role', 0)->get();

        return response()->json([
            'users' => $users
        ], 200);
    }
}
