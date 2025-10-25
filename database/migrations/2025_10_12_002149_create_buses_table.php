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
        Schema::create('buses', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('immatriculation')->unique();
            $table->string('marque')->nullable();
            $table->string('modele')->nullable();
            $table->integer('capacite')->default(50);
            $table->string('chauffeur_nom');
            $table->string('chauffeur_telephone')->nullable();
            $table->string('etat')->default('actif'); // actif, maintenance, hors_service
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('buses');
    }
};
