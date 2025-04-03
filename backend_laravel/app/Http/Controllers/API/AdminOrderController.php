<?php

namespace App\Http\Controllers\API;

use carbon\Carbon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    public function getOrders()
    {
        $orders = Order::with('user')->get();
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
    public function vieworder($id)
    {
        $order = Order::where('id', $id)->first();
        $order_number=$order->order_number;
        $orderItems = OrderItem::where('order_id', $id)->with('product')->get();
        foreach ($orderItems as $item) {
            $item->order_number = $order_number;
        }

        return response()->json(['data' => $orderItems]);
    }
    public function updateorder(Request $request, $id)
    {
        //dd($request->all());
        $order = Order::find($id);
        $order->status = $request->status;
        if ($request->status == 2) {
            $orderItems = OrderItem::where('order_id', $id)->get();
            foreach ($orderItems as $item) {
                $product = $item->product;
                if ($product) {
                    $product->stock += $item->quantity;
                    $product->save();
                }
            }
        }
        $order->update();
        return response()->json([
            "data" => $this->getOrders()
        ]);
    }
    public function updatePaymentOrder($id)
    {
        //dd($request->all());
        $order = Order::find($id);
        $order->status_payment = 'paid';
        $order->status = 1;

        $order->update();
        return response()->json([
            "data" => $this->getOrders()
        ]);
    }
}
