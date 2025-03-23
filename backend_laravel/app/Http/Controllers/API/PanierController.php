<?php

namespace App\Http\Controllers\API;

use App\Models\Panier;
use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PanierController extends Controller
{
    public function index()
    {
        $paniers = Panier::where('user_id', Auth::id())->get();
        if ($paniers->isEmpty()) {
            return response()->json(['message' => 'No products in cart']);
        }
        return response()->json($paniers);
    }

    public function store(Request $request)
    {
        $product_id = $request->input('product_id');
        $product_qty = $request->input('product_qty');

        if (Auth::check()) {
            $prod_check = Product::where('id', $product_id)->first();
            if ($prod_check) {
                if (Panier::where('product_id', $product_id)->where('user_id', Auth::id())->exists()) {
                    return response()->json(["status" => "the product " . $prod_check->name . " already Added"]);
                } else {
                    $panieItem = new Panier();
                    $panieItem->product_id = $product_id;
                    $panieItem->quantity = $product_qty;
                    $panieItem->user_id = 1;
                    $panieItem->save();
                    return response()->json(["status" => "the product " . $prod_check->name . " successfully"]);
                }
            } else {

                return response()->json(["status" => "the product doesn't exist"]);
            }
        } else {
            return response()->json(["status" => "login to Continue"]);
        }
    }
    public function update(Request $request)
    {
        $prod_id = $request->input('product_id');
        $product_qte = $request->input('product_qty');
        if (Auth::check()) {
            if (Panier::where('product_id', $prod_id)->where('user_id', Auth::id())->exists()) {
                $pane = Panier::where('product_id', $prod_id)->where('user_id', Auth::id())->first();
                $pane->quantity = $product_qte;
                $pane->save();
                return response()->json(["status" => "quantity updated"]);
            } else {
                return response()->json(["status" => "the product doesn't exist"]);
            }
        } else {
            return response()->json(["status" => "login to Continue"]);
        }
    }



    public function destroy($prod_id)
    {
        if (Auth::check()) {
            if (Panier::where('product_id', $prod_id)->where('user_id', Auth::id())->exists()) {
                $pane = Panier::where('product_id', $prod_id)->where('user_id', Auth::id())->first();
                $pane->delete();
                return response()->json(["status" => "the product successfully deleted"]);
            }
        } else {
            return response()->json(["status" => "login to Continue"]);
        }
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

    public function paniercount()
    {
        $paniercount = Panier::where('user_id', Auth::id())->count();
        return response()->json(['count' => $paniercount]);
    }
}
