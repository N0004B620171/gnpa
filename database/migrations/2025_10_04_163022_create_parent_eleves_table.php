<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('parent_eleves', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('prenom');
            $table->string('nom');
            $table->string('telephone')->nullable();
            $table->string('email')->nullable()->unique();
            $table->string('adresse')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('parent_eleves');
    }
};