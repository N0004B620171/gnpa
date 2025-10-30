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
        Schema::create('inventaire_enseignants', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('professeur_id')->constrained('professeurs')->onDelete('cascade');
            $table->foreignId('materiel_id')->constrained()->onDelete('cascade');
            $table->integer('quantite')->default(1);
            $table->enum('etat', ['bon', 'endommagé', 'perdu'])->default('bon');
            $table->date('date_attribution')->default(now());
            $table->date('date_retour')->nullable();
            $table->text('observation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventaires_enseignants');
    }
};
