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
        'total_price',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'panier_product')
                    ->withPivot('quantity'); 
    }
}
