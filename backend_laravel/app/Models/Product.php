<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $table = 'products';
<<<<<<< HEAD
    protected $fillable = ['name', 'description', 'image', 'category_id','stock','price'];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
=======
    protected $fillable = ['name', 'description', 'image', 'price', 'stock'];
}
>>>>>>> 6dfbecf9f77d13589e2892b3224c42c962c5ffde
