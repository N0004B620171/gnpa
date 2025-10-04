<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('composition_matieres', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('composition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            $table->unique(['composition_id', 'matiere_id']); // Éviter les doublons
        });
    }

    public function down()
    {
        Schema::dropIfExists('composition_matieres');
    }
};