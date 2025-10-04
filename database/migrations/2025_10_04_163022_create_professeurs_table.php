<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('professeurs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('prenom');
            $table->string('nom');
            $table->string('telephone')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('specialite')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('professeurs');
    }
};