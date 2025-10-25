<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bulletins', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();

            // Liens
            $table->foreignId('inscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trimestre_id')->nullable()->constrained()->cascadeOnDelete();
            $table->foreignId('langue_id')->nullable()->constrained()->cascadeOnDelete();


            // Typage / statut
            $table->boolean('annuel')->default(false);        // bulletin annuel (true) vs trimestriel (false)
            $table->boolean('is_controle')->default(false);   // si tu fais aussi des "bulletins de contrôle"
            $table->boolean('mark_as_last')->default(false);  // dernier bulletin effectif de l'année (utile si trimestres désactivés)
            $table->boolean('is_locked')->default(false);        // verrouillé (plus de modif possible)
            
            // Archives d'identité (snapshot)
            $table->string('annee_scolaire_nom', 100);
            $table->string('trimestre_nom')->nullable();
            $table->string('cycle_nom')->nullable();
            $table->string('eleve_nom');
            $table->string('classe_nom');
            $table->string('niveau_nom');

            // Résultats du bulletin courant (trimestre OU annuel)
            $table->decimal('moyenne_eleve', 5, 2)->nullable();
            $table->decimal('moyenne_classe', 5, 2)->nullable();
            $table->unsignedInteger('rang')->nullable();

            // Récap par trimestre pour affichage dans le dernier bulletin
            $table->decimal('moyenne_premier_trimestre', 5, 2)->nullable();
            $table->decimal('moyenne_classe_premier_trimestre', 5, 2)->nullable();

            $table->decimal('moyenne_deuxieme_trimestre', 5, 2)->nullable();
            $table->decimal('moyenne_classe_deuxieme_trimestre', 5, 2)->nullable();

            $table->decimal('moyenne_troisieme_trimestre', 5, 2)->nullable();           // restera NULL si le cycle n’a que 2 trimestres
            $table->decimal('moyenne_classe_troisieme_trimestre', 5, 2)->nullable();

            // Agrégats globaux (calculés sur les trimestres ACTIFS)
            $table->unsignedInteger('rang_global')->nullable();
            $table->decimal('moyenne_globale', 5, 2)->nullable();
            $table->decimal('moyenne_classe_globale', 5, 2)->nullable();

            // Signatures
            $table->string('professeur_nom')->nullable();
            $table->string('professeur_fonction')->nullable();
            $table->string('professeur_signature')->nullable();
            $table->string('directeur_nom')->nullable();
            $table->string('directeur_fonction')->nullable();
            $table->string('directeur_signature')->nullable();
            $table->string('parent_nom')->nullable();
            $table->string('parent_lien')->nullable();
            $table->string('parent_signature')->nullable();

            $table->timestamps();

            // Index
            $table->index(['inscription_id', 'trimestre_id']);
            $table->index('annee_scolaire_nom');

            // NB: empêche les doublons pour les bulletins TRIMESTRIELS.
            // Pour les bulletins ANNUELS (trimestre_id = NULL), MySQL autorise plusieurs NULL en unique,
            // donc il faut aussi contrôler l’unicité côté application.
            $table->unique(['inscription_id', 'trimestre_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('bulletins');
    }
};
