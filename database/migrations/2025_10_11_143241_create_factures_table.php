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
        /**
         * 🔹 3. FACTURES
         * Une facture par élève (via inscription) et par mois
         */
        Schema::create('factures', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();

            // Lien avec l'inscription
            $table->foreignId('inscription_id')->constrained()->cascadeOnDelete();

            // Période mensuelle
            $table->unsignedTinyInteger('mois'); // 1 à 12
            $table->unsignedSmallInteger('annee');

            // Montants globaux
            $table->decimal('montant_total', 10, 2)->default(0);
            $table->decimal('montant_paye', 10, 2)->default(0);
            $table->decimal('montant_restant', 10, 2)->default(0);
            $table->enum('statut', ['non_paye', 'partiel', 'paye'])->default('non_paye');
            $table->boolean('verrouillee')->default(false);

            // Snapshot élève / contexte
            $table->string('eleve_nom');
            $table->string('classe_nom');
            $table->string('niveau_nom');
            $table->string('annee_scolaire_nom');

            // Signatures / gestion
            $table->string('caissier_nom')->nullable();
            $table->string('directeur_nom')->nullable();
            $table->string('directeur_signature')->nullable();

            $table->timestamps();

            $table->unique(['inscription_id', 'mois', 'annee'], 'facture_unique_mensuelle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('factures');
    }
};
