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
        return $products;
    }

    public function store(Request $request)
    {

        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',
            'image' => 'required|string',
            'price' => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'errors' => $validate->errors()
            ], 400);
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $request->image,
            'price' => $request->price,
        ]);
        return response()->json([
            'data' => new ProductResource($product)
        ], 200);
    }

    public  function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        return new ProductResource($product);
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
            'image' => 'required',
            'price' => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'errors' => $validate->errors()
            ], 400);
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
        ]);
        return response()->json([
            'message' => 'Product updated successfully',
            'data' => new ProductResource($product)
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