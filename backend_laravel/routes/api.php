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
<<<<<<< HEAD
    Route::get("/paniers/paniercount", [PanierController::class, 'paniercount']);
    Route::get('/panier', [PanierController::class, 'index']);
    Route::post('/panier/add/', [PanierController::class, 'store']);
    Route::post('/panier/update/{productId}', [PanierController::class, 'update']);
    Route::get('/panier/remove/{productId}', [PanierController::class, 'destroy']);
    Route::get('/panier/clear', [PanierController::class, 'clearCart']);
=======
    Route::get('/paniers', [PanierController::class, 'index']);
    Route::post('/paniers', [PanierController::class, 'store']);
    Route::put('/paniers/{id}', [PanierController::class, 'update']);
    Route::delete('/paniers/{id}', [PanierController::class, 'destroy']);
>>>>>>> f6460a1635cffe4962fe94bb4fb9bf0232a22d55
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