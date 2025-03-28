<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'id',
        'user_id',
        'total_price',
        'status',
        'status_payment',
        'payment_method',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function orderitems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
