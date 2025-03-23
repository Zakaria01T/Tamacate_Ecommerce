<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaniersTable extends Migration
{
    public function up()
    {
        Schema::create('paniers', function (Blueprint $table) {
            $table->id();
<<<<<<< HEAD
            $table->bigInteger('user_id')->unsigned();
            $table->bigInteger("product_id")->unsigned();
            $table->integer('quantity');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
=======
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade'); // Fixed foreign key
            $table->integer('quantity');
            $table->timestamps();
>>>>>>> f6460a1635cffe4962fe94bb4fb9bf0232a22d55
        });
    }

    public function down()
    {
        Schema::dropIfExists('paniers');
    }
}
