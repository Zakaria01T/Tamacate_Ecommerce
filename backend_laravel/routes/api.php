<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\Api\PanierController;

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

//products
Route::apiResource('products', ProductController::class);

//paniers
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/panier', [PanierController::class, 'index']);
    Route::post('/panier/add/{productId}', [PanierController::class, 'addToCart']);
    Route::post('/panier/update/{productId}', [PanierController::class, 'updateCart']);
    Route::get('/panier/remove/{productId}', [PanierController::class, 'removeFromCart']);
    Route::get('/panier/clear', [PanierController::class, 'clearCart']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
