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
            $table->foreignId('inscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('trimestre_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('annuel')->default(false);

            // Infos archivées
            $table->string('annee_scolaire_nom',100);
            $table->string('trimestre_nom')->nullable();
            $table->string('eleve_nom');
            $table->string('classe_nom');
            $table->string('niveau_nom');

            // Résultats agrégés
            $table->float('moyenne_eleve');
            $table->integer('rang');
            $table->float('moyenne_classe');

            // Signatures
            $table->string('professeur_nom',)->nullable();
            $table->string('professeur_fonction')->nullable();
            $table->string('professeur_signature')->nullable();
            $table->string('directeur_nom')->nullable();
            $table->string('directeur_fonction')->nullable();
            $table->string('directeur_signature')->nullable();
            $table->string('parent_nom')->nullable();
            $table->string('parent_lien')->nullable();
            $table->string('parent_signature')->nullable();

            $table->timestamps();
            
            $table->index(['inscription_id', 'trimestre_id'],);
            $table->index('annee_scolaire_nom');
        });
    }

    public function down()
    {
        Schema::dropIfExists('bulletins');
    }
};