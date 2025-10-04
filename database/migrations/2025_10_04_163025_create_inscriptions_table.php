<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->date('date_inscription')->default(now());
            $table->enum('statut', ['actif', 'inactif'])->default('actif');
            $table->foreignId('classe_id')->constrained()->cascadeOnDelete();
            $table->foreignId('eleve_id')->constrained()->cascadeOnDelete();
            $table->foreignId('annee_scolaire_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            
            $table->index(['eleve_id', 'annee_scolaire_id']);
            $table->index('statut');
            $table->unique(['eleve_id', 'annee_scolaire_id']); // Un élève ne peut s'inscrire qu'une fois par année
        });
    }

    public function down()
    {
        Schema::dropIfExists('inscriptions');
    }
};