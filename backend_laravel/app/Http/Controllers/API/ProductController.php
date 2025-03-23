<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        if ($products->isEmpty()) {
            return response()->json(['message' => 'No products found'], 200);
        }

        // Encoder chaque image en base64 avant de retourner la réponse
        $products->transform(function ($product) {
            $product->image = $product->image ? 'data:image/png;base64,' . base64_encode($product->image) : null;
            return $product;
        });

        return response()->json(['data' => $products], 200);
    }

    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'price' => 'required|numeric',
            'category_id' => 'required',
            'stock' => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return response()->json(['errors' => $validate->errors()], 400);
        }

        $imageData = file_get_contents($request->file('image')->getRealPath());

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $imageData,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'stock' => $request->stock,
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => 'data:image/png;base64,' . base64_encode($product->image),
                'price' => $product->price,
            ]
        ], 200);
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => $product->image ? 'data:image/png;base64,' . base64_encode($product->image) : null,
                'price' => $product->price,
                'category_id' => $product->category_id,
                'stock' => $product->stock,
            ]
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'price' => 'required|numeric',
            'category_id' => 'required',
            'stock' => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return response()->json(['errors' => $validate->errors()], 400);
        }

        if ($request->hasFile('image')) {
            $imageData = file_get_contents($request->file('image')->getRealPath());
        } else {
            $imageData = $product->image;
        }

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $imageData,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'stock' => $request->stock,
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'image' => $product->image ? 'data:image/png;base64,' . base64_encode($product->image) : null,
                'price' => $product->price,
                'category_id' => $product->category_id,
                'stock' => $product->stock,
            ]
        ], 200);
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}
