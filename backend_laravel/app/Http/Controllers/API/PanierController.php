<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;
use App\Models\Panier;
use Illuminate\Support\Facades\Auth;

class PanierController extends Controller
{

    public function index()
    {
        $paniers = Panier::where('user_id', Auth::id())->with('product')->get();

        // Convertir les données en un format UTF-8 sûr
        $paniers = json_decode(json_encode($paniers, JSON_UNESCAPED_UNICODE), true);

        return response()->json($paniers, 200, [], JSON_UNESCAPED_UNICODE);
    }


    public function store(Request $request)
    {
        try {
            $validate = Validator::make($request->all(), [
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
            ]);
            // $request->validate([
            //     'product_id' => 'required|exists:products,id',
            //     'quantity' => 'required|integer|min:1',
            // ]);
            if ($validate->fails()) {
                return response()->json(['errors' => $validate->errors()], 400);
            }


            $panier = Panier::create(
                [
                    'user_id' => Auth::id(),
                    'product_id' => $request->product_id,

                'quantity' => $request->quantity
                ]
            );

            return response()->json(['message' => 'Product added to panier', 'panier' => $panier], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'An error occurred while adding the product to the panier.'], 500);
        }
    }



    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $panier = Panier::where('user_id', Auth::id())->findOrFail($id);
        $panier->update(['quantity' => $request->quantity]);

        return response()->json(['message' => 'Panier updated', 'panier' => $panier]);
    }


    public function destroy($id)
    {
        $panier = Panier::where('user_id', Auth::id())->findOrFail($id);
        $panier->delete();

        return response()->json(['message' => 'Product removed from panier']);
    }
}
