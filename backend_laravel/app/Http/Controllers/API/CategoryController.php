<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    public function index()
    {
        $cateogry = Category::all();
        if ($cateogry->isEmpty()) {
            return response()->json(['message' => "no category existe"], 200);
        }
        return response()->json($cateogry, 200);
    }

    public function store(Request $request)
    {

        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',

        ]);

        if ($validate->fails()) {
            return response()->json(['errors' => $validate->errors()], 400);
        }

        $category = category::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json([
            'message' => 'Category added successfully',
            'data' => $category
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $validate = Validator::make($request->all(), [
            'name' => 'required|string|max:70',
            'description' => 'required|string',

        ]);
        if ($validate->fails()) {
            return response()->json(['errors' => $validate->errors()], 400);
        }

        $category->name = $request->name;
        $category->description = $request->description;

        $category->update();
        return response()->json([
            'message' => 'Product updated successfully',
            'data' => $category
        ], 200);
    }
    public function delete($id)
    {
        $cat = category::findOrFail($id);
        if (!$cat) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $cat->delete();

        return response()->json(['message' => 'Category deleted successfully'], 200);
    }
}
