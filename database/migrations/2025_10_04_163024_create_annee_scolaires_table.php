<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('annee_scolaires', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('nom', 100)->unique();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->boolean('actif')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->index('actif');
        });
    }

    public function down()
    {
        Schema::dropIfExists('annee_scolaires');
    }
};