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
<<<<<<< HEAD
<<<<<<< HEAD

        $products->transform(function ($product) {
            $product->image = base64_encode($product->image);
            return $product;
        });

        return ProductResource::collection($products);
=======
=======
        foreach ($products as $product) {
            $product->image = 'data:image/jpeg;base64,' . $product->image;
        }
>>>>>>> 6dfbecf9f77d13589e2892b3224c42c962c5ffde
        return $products;
>>>>>>> f6460a1635cffe4962fe94bb4fb9bf0232a22d55
    }

    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',
<<<<<<< HEAD
            'image' => 'required|mimes:jpg,jpeg,png', // Ensure it's a file
=======
            'image' => 'required|string',
>>>>>>> f6460a1635cffe4962fe94bb4fb9bf0232a22d55
            'price' => 'required|numeric',
<<<<<<< HEAD
            'stock'=>'required|numeric',
=======
            'stock' => 'required|numeric'
>>>>>>> 6dfbecf9f77d13589e2892b3224c42c962c5ffde
        ]);

        if ($validate->fails()) {
<<<<<<< HEAD
            return response()->json(['errors' => $validate->errors()], 400);
        }
        dd($request->all());
        // Convert image to Base64
=======
            return response()->json([
                'errors' => $validate->errors()
            ], 400);
        }
>>>>>>> f6460a1635cffe4962fe94bb4fb9bf0232a22d55



        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $request->image,
            'stock' => $request->stock,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'stock' => $request->stock
        ]);
<<<<<<< HEAD

        return response()->json(['data' => new ProductResource($product)], 201);
=======
        return response()->json([
            'data' => new ProductResource($product)
        ], 200);
>>>>>>> f6460a1635cffe4962fe94bb4fb9bf0232a22d55
    }


    public  function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Convert binary image to base64 before returning
        $product->image = base64_encode($product->image);

        return new ProductResource($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }
        //dd($request->all());
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category_id' => 'required',
            'price' => 'required|numeric',
            'stock'=>'required|numeric',
        ]);

        if ($validate->fails()) {
            return response()->json([
                'errors' => $validate->errors()
            ], 400);
        }

<<<<<<< HEAD
        if ($request->has('image')) {
            $imageData = base64_decode($request->image);
        } else {
            $imageData = $product->image;
        }
=======
>>>>>>> 6dfbecf9f77d13589e2892b3224c42c962c5ffde

        $product->update([
            'name' => $request->name,
            'description' => $request->description,
<<<<<<< HEAD
            'image' => $imageData,
            "category_id" => $request->category_id,
            'price' => $request->price,
            'stock' => $request->stock
=======
            'image' => $request->image,
            'stock' => $request->stock,
            'price' => $request->price
>>>>>>> 6dfbecf9f77d13589e2892b3224c42c962c5ffde
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