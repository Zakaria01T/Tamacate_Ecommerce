<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Exception;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['message' => $validator->errors()], 422);
            }

            if (Auth::attempt($request->only('email', 'password'))) {
                $user = Auth::user();
                $token = $user->createToken('auth-token')->plainTextToken;

                return response()->json([
                    'user' => [
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                        'isAdmin' => $user->user_role
                    ],
                    'token' => $token
                ], 200);
            } else {
                return response()->json(['message' => 'Email or Password is invalid'], 401);
            }
        } catch (Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json(['message' => 'An error occurred during login'], 500);
        }
    }

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $user = new User();
            $user->first_name = $request->first_name;
            $user->last_name = $request->last_name;
            $user->email = $request->email;
            $user->password = bcrypt($request->password);

            if ($user->save()) {
                return response()->json(['message' => 'Sign up successful'], 201);
            } else {
                return response()->json(['error' => 'Sign up failed'], 500);
            }
        } catch (Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during registration'], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $user = $request->user();

            if ($user) {
                $user->tokens()->delete();
                Log::info('User logged out.', ['user' => $user]);
                return response()->json(['message' => 'Logout successful'], 200);
            } else {
                return response()->json(['message' => 'User not authenticated'], 401);
            }
        } catch (Exception $e) {
            Log::error('Logout error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during logout'], 500);
        }
    }

    public function user(Request $request)
    {
        try {
            Log::info('User request received.', ['user' => $request->user()]);
            return response()->json($request->user());
        } catch (Exception $e) {
            Log::error('Error fetching user: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while retrieving user data'], 500);
        }
    }





    public function checkEmail(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $emailExists = User::where('email', $request->email)->exists();

            return response()->json(['emailExists' => $emailExists]);
        } catch (Exception $e) {
            Log::error('Error checking email: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while checking the email'], 500);
        }
    }
}