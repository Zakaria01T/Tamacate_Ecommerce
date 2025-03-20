<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Panier extends Model
{
    use HasFactory;

    protected $table = 'paniers';

    protected $fillable = [
        'user_id',
        'product_id',
        'quantity',
    ];

    // A panier (cart) can have many products (through a pivot table)
    public function products()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
