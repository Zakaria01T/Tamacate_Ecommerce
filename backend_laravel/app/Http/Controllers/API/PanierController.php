<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Panier;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PanierController extends Controller
{
    // Get the user's cart
    public function index()
    {
        $userId = Auth::id();
        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        return response()->json([
            'panier' => $panier->load('products')
        ]);
    }

    // Add a product to the cart
    public function addToCart(Request $request, $productId)
    {
        $userId = Auth::id();
        $product = Product::find($productId);

        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }


            $panier = Panier::create(
                [
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id,

                'quantity' => $request->quantity
                ]
            );

            return response()->json(['message' => 'Product added to panier', 'panier' => $panier], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while adding the product to the panier.'], 500);
        }
    }



    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $userId = Auth::id();
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

    // Remove a product from the cart
    public function removeFromCart($productId)
    {
        $userId = Auth::id();
        $panier = Panier::where('user_id', $userId)->first();

        if (!$panier) {
            return response()->json(['error' => 'Cart not found'], 404);
        }

        $panier->products()->detach($productId);

        return response()->json(['message' => 'Product removed from cart']);
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