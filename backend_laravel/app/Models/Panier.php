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

<<<<<<< HEAD
    // A panier (cart) can have many products (through a pivot table)
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
=======
    public function user()
    {
        return $this->belongsTo(User::class);
>>>>>>> f6460a1635cffe4962fe94bb4fb9bf0232a22d55
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}