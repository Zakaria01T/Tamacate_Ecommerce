<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
class ClientOrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())->with(['orderitems.product', 'user','orderitems'])->get();
        return response()->json($orders);
    }
    public function vieworder($id)
    {
        $orderItems  = OrderItem::where('order_id', $id)->with('product',"order")->get();
        return response()->json($orderItems);
    }


    public function uncomplete($id)
    {
        $order = Order::where('id', $id)->first();
        $order->status = "2";
        $order->save();
        return response()->json(["message"=>"the ordre was Canceled succesfully "]);
    }
}
