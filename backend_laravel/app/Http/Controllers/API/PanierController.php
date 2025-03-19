<?php

namespace App\Http\Controllers\API;

use App\Models\Panier;
use App\Models\Product;
use App\Http\Controllers\Controller;  
use Illuminate\Http\Request;

class PanierController extends Controller
{
    public function index()
    {
        $userId = auth()->user()->id; 
        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        return response()->json([
            'panier' => $panier->load('products')
        ]);
    }

    public function addToCart(Request $request, $productId)
    {
        $userId = auth()->user()->id;
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $panier = Panier::firstOrCreate(['user_id' => $userId]);

        $existingProduct = $panier->products()->where('product_id', $productId)->first();

        if ($existingProduct) {
            $panier->products()->updateExistingPivot($productId, [
                'quantity' => $existingProduct->pivot->quantity + 1,
                'price' => $product->price
            ]);
        } else {
            $panier->products()->attach($productId, [
                'quantity' => 1,
                'price' => $product->price
            ]);
        }

        return response()->json(['message' => 'Product added to cart']);
    }

    public function updateCart(Request $request, $productId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $userId = auth()->user()->id; 

        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        $product = $panier->products()->where('product_id', $productId)->first();

        if (!$product) {
            return response()->json(['error' => 'Product not in cart'], 404);
        }

        $panier->products()->updateExistingPivot($productId, [
            'quantity' => $request->quantity
        ]);

        return response()->json(['message' => 'Cart updated']);
    }

    public function removeFromCart($productId)
    {
        $userId = auth()->user()->id; 
        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        $panier->products()->detach($productId);

        return response()->json(['message' => 'Product removed from cart']);
    }

    public function clearCart()
    {
        $userId = auth()->user()->id; 

        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        $panier->products()->detach();

        return response()->json(['message' => 'Cart cleared']);
    }
}
