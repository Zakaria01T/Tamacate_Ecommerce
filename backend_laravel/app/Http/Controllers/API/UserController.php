<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


class UserController extends Controller
{
    public function getUser(Request $request)
    {
        return response()->json(['user' => $request->user()]);
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

        // Verify current password
        if (Hash::check($currentPassword, $user->password)) {
            // Hash and update the new password
            $user->password = Hash::make($newPassword);
            $user->save();

            return response()->json(['message' => 'Password updated successfully'], 200);
        } else {
            return response()->json(['message' => 'Current password is incorrect'], 422);
        }
    }

    public function updateUser(Request $request)
    {
        try {

            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }
            $validator = Validator::make($request->all(), [
                'first_name' => 'string|max:255',
                'last_name' => 'string|max:255',
                'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
                'image' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user->update($request->all());

            return response()->json(['message' => 'User data updated successfully', 'user' => $user], 200);
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
}
