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
            if (!$prod || $prod->stock < $item["pivot"]["quantity"]) {
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
                "return_url" => route('payment_success', ['id' => Auth::id()]),
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
            $this->makeOrderFromPaypal("success", $request->query('id'));
            return redirect(env('APP_URL') . ':3000/orders');
        }
        $this->makeOrderFromPaypal("cancelled");

        return redirect(env('APP_URL') . ':3000/orders?payment=success')->with('error', 'Payment failed. Please try again.');
    }
    public function cancel()
    {
        return redirect(env('APP_URL') . ':3000/cart?payment=cancelled')->with('error', 'Payment failed. Please try again.');
    }
    public function makeOrderFromPaypal($status, $userId = null)
    {
        if ($status == "cancelled") {
            return redirect(env('APP_URL') . ':3000/cart?payment=cancelled')->with('error', 'Payment failed. Please try again.');
        }
        $pannier = Panier::where('user_id', $userId)->with("products")->first();

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
        $order->user_id = $userId;

        $total = 0;
        $order->order_number = "ORD" .  rand(1111, 9999);
        $order->payment_method = "paypal";
        $order->status_payment = "paid";
        $order->status = 1;
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

        return response()->json([
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
        $order->order_number = "ORD" .  rand(1111, 9999);
        $order->payment_method = "cash";
        $order->status_payment = "unpaid";
        $order->status = 0; // 0:pending, 1:Confirmed, 2:Cancelled

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
            'status' => 'success',
            'message' => 'Your order was added successfully.',
        ]);
    }
}
