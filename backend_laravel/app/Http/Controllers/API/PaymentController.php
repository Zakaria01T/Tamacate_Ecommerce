<?php

namespace App\Http\Controllers\API;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Panier;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class PaymentController extends Controller
{

    //functions to make an order that has a payment METHODE (PAYPAL)
    //.............................................................................


    //fonction pour un ordre qui a une payment (payer jusque la commande arrive à la maison)
    public function makeOrder()
    {
        $order = new Order();
        $order->user_id = Auth()->user()->id;
        $total = 0;
        $carteitems_total = Panier::where('user_id', Auth::id())->get();
        foreach ($carteitems_total as $prod) {
            $total += $prod->product->prix_vent;
        }
        $order->total_price = $total;
        $order->save();

        $carteitems = Panier::where('user_id', Auth::id())->get();
        foreach ($carteitems as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
            ]);
        }

        $carteitems = Panier::where('user_id', Auth::id())->get();
        Panier::destroy($carteitems);
        return response()->json([
            'status' => 'Your order was added successfully.',
        ]);
    }
}
