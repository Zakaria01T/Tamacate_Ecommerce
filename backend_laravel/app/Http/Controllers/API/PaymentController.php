<?php

namespace App\Http\Controllers\API;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Panier;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Srmklive\PayPal\Services\PayPal as PayPalClient;


class PaymentController extends Controller
{

    //functions to make an order that has a payment METHODE (PAYPAL)
    //.............................................................................
    public function payment()
    {
        $pannier = Panier::where('user_id', Auth::id())->with("products")->first();
        if (!$pannier) {
            return response()->json([
                'status' => 'Your cart is empty.',
            ], 400);
        }
        $pannieritems = $pannier->products->toArray();
        $flag = false;
        $NameproductOutOfStock = [];
        foreach ($pannieritems as $item) {
            $prod = Product::find($item['id']);
            if ($prod->stock < $item["pivot"]["quantity"]) {
                $flag = true;
                array_push($NameproductOutOfStock, $prod->name);
            }
        }

        if ($flag) {
            return response()->json([
                'status' => 'The following products are out of stock.',
                'products' => $NameproductOutOfStock,
            ], 400);
        }

        $total = 0;

        foreach ($pannieritems as $prod) {
            $total += $prod['price'] * $prod['pivot']['quantity'];
        }

        $provider = new PayPalClient;
        $provider->setApiCredentials(config("paypal"));
        $provider->getAccessToken(); // Ensure access token is retrieved
        $response = $provider->createOrder([
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => route('payment_success', ['token' => csrf_token()]),
                "cancel_url" => route('payment_cancel'),
            ],
            "purchase_units" => [
                [
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $total,
                    ]
                ]
            ]
        ]);

        if (isset($response['id']) && $response['id'] != null && isset($response['links'])) {
            foreach ($response["links"] as $link) {
                if ($link["rel"] === 'approve') {
                    return response()->json([
                        "status" => "success",
                        "payment_id" => $response["id"],
                        "approval_url" => $link['href'],
                    ]);
                }
            }
        }

        return response()->json([
            "status" => "error",
            "message" => "Unable to initiate payment",
        ], 500);
    }

    public function success(Request $request)
    {
        $provider = new PayPalClient;
        $provider->setApiCredentials(config("paypal"));
        $provider->getAccessToken();
        $response = $provider->capturePaymentOrder($request->query('token'));
        if (isset($response["status"]) && $response["status"] == "COMPLETED") {
            return response()->json([
                "status" => "success",
                "message" => "Payment successful.",
            ]);
        }

        return response()->json([
            "status" => "cancelled",
            "message" => "Payment Failed.",

        ], 400);
    }
    public function cancel()
    {
        return response()->json([
            "status" => "cancelled",
            "message" => "The payment was canceled by the user.",
        ]);
    }
    public function makeOrderFromPaypal(Request $request)
    {
        if ($request->status == "cancelled") {
            return response()->json([
                "status" => "failed",
                "message" => "You have trouble paying for the order.",
            ], 500);
        }
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
        foreach ($pannieritems as $item) {
            // dd($item);
            $prod = Product::find($item['id']);
            if ($prod->stock < $item["pivot"]["quantity"]) {
                $flag = true;
                array_push($NameproductOutOfStock, $prod->name);
            }
        }

        if ($flag) {
            return response()->json([
                'status' => 'The following products are out of stock.',
                'products' => $NameproductOutOfStock,
            ], 400);
        }

        $order = new Order();
        $order->user_id = Auth()->user()->id;

        $total = 0;
        $order->payment_method = "paypal";
        $order->status_payment = "paid";
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









    //fonction pour un ordre qui a une payment (payer jusque la commande arrive à la maison)
    public function makeOrder()
    {
        $pannier = Panier::where('user_id', Auth::id())->with("products")->first();

        if (!$pannier) {
            return response()->json([
                'message' => 'Your cart is empty.',
            ], 400);
        }
        //return response()->json($carteitems);
        //dd($pannier->products->toArray()); // Cela affichera les produits du premier panier trouvé
        // dd($pannier);
        $pannieritems = $pannier->products->toArray();
        $flag = false;
        $NameproductOutOfStock = [];
        // dd($pannieritems);
        foreach ($pannieritems as $item) {
            // dd($item);
            $prod = Product::find($item['id']);
            if ($prod->stock < $item["pivot"]["quantity"]) {
                $flag = true;
                array_push($NameproductOutOfStock, $prod->name);
            }
        }

        if ($flag) {
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
            'status' => 'Successed',
            'message' => 'Your order was added successfully.',
        ]);
    }
}