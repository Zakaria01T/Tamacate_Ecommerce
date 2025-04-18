<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ClientOrderController extends Controller
{
    public function getOrders()
    {
        $orders = Order::where('user_id', Auth::id())->with("user")->get();
        $status = [
            'Pending',
            'Confirmed',
            'Cancelled',
        ];

        foreach ($orders as $order):
            $order->status = $status[$order->status];
        endforeach;

        return $orders;
    }
    public function index()
    {

        return response()->json(['data' => $this->getOrders()]);
    }

    public function vieworder($id){
        $orderItems  = OrderItem::where('order_id', $id)->with('product', "order")->get();
        return response()->json(['data' =>$orderItems]);
    }


    public function uncomplete($id)
    {
        $order = Order::where('id', $id)->with("orderitems")->first();
        if ($order->payment_status == "paid") {
            return response()->json(["message" => "the ordre is already paid"], 400);
        }
        if ($order->status == "2") {
            return response()->json(["message" => "the ordre is already Canceled"], 400);
        }

        $orderItems  = OrderItem::where('order_id', $id)->with('product', "order")->get();
        foreach ($orderItems as $item) {
            $prod = Product::find($item->product_id);
            $prod->stock += $item->quantity;
            $prod->save();
        }
        $order->status = "2";
        $order->save();
        return response()->json(["message" => "the ordre was Canceled succesfully "]);
    }
}
