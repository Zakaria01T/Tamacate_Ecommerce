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
    Route::post('/paniers', [PanierController::class, 'addToCart']);
    Route::put('/paniers/{productId}', [PanierController::class, 'update']);
    Route::delete('/paniers/{productId}', [PanierController::class, 'removeFromCart']);
    Route::delete('/paniers', [PanierController::class, 'clearCart']);
});

// payment : cash or  paypal
Route::middleware('auth:sanctum')->group(function () {
    Route::get('payment_COD', [PaymentController::class, 'makeOrder']);
    Route::get('payment_paypal', [PaymentController::class, 'payment']);
    Route::get('payment_success', [PaymentController::class, 'success'])->name("payment_success");
    Route::get('payment_cancel', [PaymentController::class, 'cancel'])->name("payment_cancel");
});

//client Order
Route::middleware('auth:sanctum')->group(function () {
    Route::get("/uncomplete_order/{id}", [ClientOrderController::class, 'uncomplete']);
    Route::get('client_order/{id}', [ClientOrderController::class, 'vieworder']);
    Route::get('client_order', [ClientOrderController::class, 'index']);
});



//admin order
Route::middleware('auth:sanctum')->controller(AdminOrderController::class)->group(function () {
    Route::get('admin_order', [AdminOrderController::class, 'index']);
    Route::get('admin_order/{id}', [AdminOrderController::class, 'vieworder']);
    Route::put('admin_order/{id}', [AdminOrderController::class, 'updateorder']);
    Route::put('admin_order_payment/{id}', [AdminOrderController::class, 'updatePaymentOrder']);
    Route::get('admin_order_history', [AdminOrderController::class, 'historyorder']);
});

//user
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/getUser', [UserController::class, 'getUser']);
    Route::put('/updateUser', [UserController::class, 'updateUser']);
    Route::put('/updatePassword', [UserController::class, 'updatePassword']);
    Route::delete('/delete-account', [UserController::class, 'deleteAccount']);
    Route::get('/users', [UserController::class, 'getNotAdmittedUsers']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
