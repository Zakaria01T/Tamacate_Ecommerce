<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Panier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;

class PanierController extends Controller
{
    // Retrieve the user's cart
    public function index()
    {
        $userId = Auth::id();
        $panier = Panier::where('user_id', $userId)->with('products')->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }
        $products = $panier->products;

        return response()->json(['data' => $products->map(function ($product) {
            return
                array_merge((new ProductResource($product))->toArray(request()), [
                    'quantity' => $product->pivot->quantity,
                ]);
        })]);
    }

    // Add a product to the cart
    public function addToCart(Request $request)
{
    try {
        $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

            $userId = Auth::id();
            $productId = $request->input('product_id');

        $panier = Panier::firstOrCreate(['user_id' => $userId]);

            // Attach product to cart (assuming many-to-many relation)
            $panier->products()->attach($productId, ['quantity' => $request->input('quantity')]);

            return response()->json(['message' => 'Product added to cart', 'panier' => $panier->load('products')], 201);
        } catch (Exception $e) {
            return response()->json(['error' => 'An error occurred while adding the product to the cart.'], 500);
        }
    }

    // Update product quantity in the cart
    public function update(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $userId = Auth::id();
        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        if (!$panier->products()->where('product_id', $productId)->exists()) {
            return response()->json(['error' => 'Product not in cart'], 404);
        }

        $panier->products()->updateExistingPivot($productId, ['quantity' => $request->quantity]);

        return response()->json(['data' => $panier->products->map(function ($product) {
            return
                array_merge((new ProductResource($product))->toArray(request()), [
                    'quantity' => $product->pivot->quantity,
                ]);
        })]);
    }

    // Remove a product from the cart
    public function removeFromCart($productId)
    {
        $userId = Auth::id();
        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        if (!$panier->products()->where('product_id', $productId)->exists()) {
            return response()->json(['error' => 'Product not in cart'], 404);
        }

        $panier->products()->detach($productId);

        return response()->json(['data' => $panier->products->map(function ($product) {
            return
                array_merge((new ProductResource($product))->toArray(request()), [
                    'quantity' => $product->pivot->quantity,
                ]);
        })]);
    }

    // Clear the cart
    public function clearCart()
    {
        $userId = Auth::id();
        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        $panier->products()->detach();

        return response()->json(['message' => 'Cart cleared']);
    }
}