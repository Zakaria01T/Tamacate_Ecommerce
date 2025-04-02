<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        if ($products->isEmpty()) {
            return response()->json([], 200);
        }
        return response()->json($products, 200);
    }

    public function store(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',
            'image' => 'required|image|mimes:png,jpg,svg,jpeg',
            'price' => 'required|numeric',
            'category_id' => 'required',
            'stock' => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return response()->json(['error' => $validate->errors()], 400);
        }
        //to save the image
        $filename = 'default.jpg';

        if ($request->hasfile('image')) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension(); // Récupérer l'extension de l'image
            $filename = time() . '.' . $extension; // Générer un nom unique
            $path = 'images/products';
            $file->move(public_path($path), $filename); // Déplacer l'image
        }

        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $filename,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'stock' => $request->stock,
        ]);

        return response()->json([
            'message' => 'Product created successfully',
            'data' => $product
        ], 200);
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([$product], 200);
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
            'price' => 'required|numeric',
            'image' => 'image|mimes:png,jpg,svg,jpeg',
            'category_id' => 'required',
            'stock' => 'required|numeric',
        ]);

        if ($validate->fails()) {
            return response()->json(['errors' => $validate->errors()], 400);
        }

        $product = Product::find($id);
        $filename = $product->image;
        if ($request->hasfile('image')) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension(); // Récupérer l'extension de l'image
            $filename = time() . '.' . $extension; // Générer un nom unique
            $path = 'images/products';
            $file->move(public_path($path), $filename); // Déplacer l'image
        }
        $product->update([
            'name' => $request->name,
            'description' => $request->description,
            'image' => $filename,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'stock' => $request->stock,
        ]);

        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $product
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