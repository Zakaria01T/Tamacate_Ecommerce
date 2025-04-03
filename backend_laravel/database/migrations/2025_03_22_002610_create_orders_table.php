<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('user_id');
            $table->string('order_number')->unique();
            $table->double('total_price');
            $table->integer('status')->default(0)->comment('0:pending, 1:Confirmed, 2:Cancelled');
            $table->enum('status_payment', ['paid', 'unpaid'])->default('unpaid');
            $table->enum('payment_method', ['cash', 'paypal'])->default('cash');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
