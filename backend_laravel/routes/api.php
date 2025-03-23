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
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

//products
Route::apiResource('products', ProductController::class);
// Route::middleware('auth:sanctum')->group(function () {
// });

//Orders :
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/makeOrder', [PaymentController::class, 'makeOrder']);
    //show orders for a client
    Route::get('/clientOrders', [ClientOrderController::class, 'index']);
    Route::get("/vieworder/{id}", [ClientOrderController::class, 'vieworder']);
});

//paniers
// Route::apiResource('paniers', PanierController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::get("/paniers/paniercount", [PanierController::class, 'paniercount']);
    Route::get('/panier', [PanierController::class, 'index']);
    Route::post('/panier/add/', [PanierController::class, 'store']);
    Route::post('/panier/update/{productId}', [PanierController::class, 'update']);
    Route::get('/panier/remove/{productId}', [PanierController::class, 'destroy']);
    Route::get('/panier/clear', [PanierController::class, 'clearCart']);
});

//user
Route::middleware('auth:sanctum')->put('/updateUser', [UserController::class, 'updateUser']);
Route::middleware('auth:sanctum')->put('/updatePassword', [UserController::class, 'updatePassword']);
Route::middleware('auth:sanctum')->delete('/delete-account', [UserController::class, 'deleteAccount']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
