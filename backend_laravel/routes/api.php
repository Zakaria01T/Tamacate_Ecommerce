<?php

use App\Http\Controllers\API\AdminOrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
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
Route::get('/products', [ProductController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
});

//categories
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);
Route::put('/categories/{id}', [CategoryController::class, 'update']);
Route::delete('/categories/{id}', [CategoryController::class, 'delete']);


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
});

Route::get("/uncomplete_order/{id}", [ClientOrderController::class, 'uncomplete']);
Route::get('client_order/{id}', [ClientOrderController::class, 'vieworder']);
Route::get('client_order', [ClientOrderController::class, 'index']);

//admin order
Route::middleware('auth:sanctum')->controller(AdminOrderController::class)->group(function () {
    Route::get('admin_order', [AdminOrderController::class, 'index']);
    Route::get('admin_order/{id}', [AdminOrderController::class, 'vieworder']);
    Route::put('admin_order_update/{id}', [AdminOrderController::class, 'updateorder']);
    Route::get('admin_order_history', [AdminOrderController::class, 'historyorder']);
});

//user
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/updateUser', [UserController::class, 'updateUser']);
    Route::put('/updatePassword', [UserController::class, 'updatePassword']);
    Route::delete('/delete-account', [UserController::class, 'deleteAccount']);
    Route::get('/users',[UserController::class,'getNotAdmittedUsers']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
