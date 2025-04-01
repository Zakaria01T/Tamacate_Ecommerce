<?php

namespace App\Http\Controllers\API;

use carbon\Carbon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::where('status', '0')
            ->where('status_payment', 'unpaid')
            ->get();
        foreach ($orders as $order):

            $order->status = 'Pending';

        endforeach;
        return response()->json(['data' => $orders]);
    }
    public function vieworder($id)
    {
        $orderItems = OrderItem::where('order_id', $id)->with('product')->get();
        return response()->json($orderItems);
    }
    public function updateorder(Request $request, $id)
    {
        //dd($request->all());
        $order = Order::find($id);
        $order->status = $request->status;
        $order->status_payment = $request->status_payment;
        $order->update();
        return response()->json([
            "data" => $order,
            "message" => "the order was updated successfully"
        ]);
    }
    public function historyorder()
    {
        $orders = Order::whereIn('status', [1, 2])
            ->where('status_payment', 'paid')
            ->get();
        return response()->json($orders);
    }
    public function historyorderdetails($id)
    {
        $orderItems = OrderItem::where('order_id', $id)->with('product')->get();
        return response()->json($orderItems);
    }
}
