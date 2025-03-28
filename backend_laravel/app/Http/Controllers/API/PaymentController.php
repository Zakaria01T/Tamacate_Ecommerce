<?php

namespace App\Http\Controllers\API;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Panier;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class PaymentController extends Controller
{

    //functions to make an order that has a payment METHODE (PAYPAL)
    //.............................................................................


    //fonction pour un ordre qui a une payment (payer jusque la commande arrive à la maison)
    public function makeOrder() {
        $pannier = Panier::where('user_id', Auth::id())->with("products")->first();

        if (!$pannier) {
            return response()->json([
                'status' => 'Your cart is empty.',
            ], 400);
        }
        //return response()->json($carteitems);
        //dd($pannier->products->toArray()); // Cela affichera les produits du premier panier trouvé
        // dd($pannier);
        $pannieritems = $pannier->products->toArray();
        $flag = false;
        $NameproductOutOfStock = [];
        // dd($pannieritems);
        foreach($pannieritems as $item){
            // dd($item);
            $prod = Product::find($item['id']);
            if ($prod->stock < $item["pivot"]["quantity"]) {
                $flag = true;
                array_push($NameproductOutOfStock, $prod->name);
            }
        }

        if($flag){
            return response()->json([
                'status' => 'The following products are out of stock.',
                'products' => $NameproductOutOfStock,
            ], 400);
        }

        $order = new Order();
        $order->user_id = Auth()->user()->id;

        $total = 0;

        foreach ($pannieritems as $prod) {
            $total += $prod['price'] * $prod['pivot']['quantity'];
        }
        $order->total_price = $total;
        $order->save();
        

        foreach ($pannieritems as $item) {
            $prod = Product::find($item['id']);
            $prod->stock -= $item['pivot']['quantity'];
            $prod->save();
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['id'],
                'quantity' => $item['pivot']['quantity'],
            ]);
        }

        $pannier->products()->detach(); // Remove all related products from panier_product table
        $pannier->delete(); // Delete the panier

        return response()->json(data: [
            'status' => 'Your order was added successfully.',
        ]);
    }
}
