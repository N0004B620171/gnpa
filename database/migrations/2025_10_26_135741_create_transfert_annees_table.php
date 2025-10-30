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
        Schema::create('transferts_annees', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('inscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('ancienne_annee_id')->constrained('annee_scolaires')->cascadeOnDelete();
            $table->foreignId('nouvelle_annee_id')->constrained('annee_scolaires')->cascadeOnDelete();
            $table->enum('statut', ['passant', 'redoublant', 'sortant'])->default('passant');
            $table->foreignId('nouvelle_classe_id')->nullable()->constrained('classes')->nullOnDelete();
            $table->timestamps();

            $table->unique(['inscription_id', 'nouvelle_annee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transfert_annees');
    }
};
