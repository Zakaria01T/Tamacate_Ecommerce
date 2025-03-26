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
        $carteitems = Panier::where('user_id', Auth::id())->get();
        $flag = false;
        $NameproductOutOfStock = [];
        foreach($carteitems as $item){
            $prod = Product::find($item->product_id);
            if ($prod->stock < $item->quantity) {
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

        if($carteitems->isEmpty()){
            return response()->json([
                'status' => 'Your cart is empty.',
            ], 400);
        }

        foreach ($carteitems as $prod) {
            $total += $prod->product->price * $prod->quantity;
        }
        $order->total_price = $total;

        $order->save();


        foreach ($carteitems as $item) {
            $prod = Product::find($item->product_id);
            $prod->stock -= $item->quantity;
            $prod->save();
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
            ]);
        }

        Panier::destroy($carteitems);
        return response()->json([
            'status' => 'Your order was added successfully.',
        ]);
    }
}
