<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ClientOrderController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\Api\PanierController;
use App\Http\Controllers\API\PaymentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//login and register
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

//products
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('products', ProductController::class);
});

//paniers
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/paniers', [PanierController::class, 'index']);
    Route::post('/paniers', [PanierController::class, 'store']);
    Route::put('/paniers/{id}', [PanierController::class, 'update']);
    Route::delete('/paniers/{id}', [PanierController::class, 'destroy']);
});

// order

Route::middleware('auth:sanctum')->group(function () {
    Route::get('payment_order', [PaymentController::class, 'makeOrder']);
    Route::get('client_order', [ClientOrderController::class, 'index']);
    Route::get('client_order/{id}', [ClientOrderController::class, 'vieworder']);
});

//user
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/updateUser', [UserController::class, 'updateUser']);
    Route::put('/updatePassword', [UserController::class, 'updatePassword']);
    Route::delete('/delete-account', [UserController::class, 'deleteAccount']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});