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
        Schema::create('historique_transferts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('ancienne_annee_id')->constrained('annee_scolaires')->cascadeOnDelete();
            $table->foreignId('nouvelle_annee_id')->constrained('annee_scolaires')->cascadeOnDelete();
            $table->json('nouveaux_inscriptions_ids'); // IDs créés
            $table->json('transferts_ids'); // IDs de la table transferts_annees
            $table->boolean('annulable')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historique_transferts');
    }
};
