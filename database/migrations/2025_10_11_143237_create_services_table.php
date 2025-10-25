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
         * 🔹 1. SERVICES
         * Liste des services facturables (scolarité, cantine, transport, etc.)
         */
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();

            $table->string('nom'); // Ex: Scolarité, Transport, Cantine
            $table->string('code')->nullable()->unique(); // Ex: SCOL_MENS, TRANS
            $table->decimal('montant', 10, 2)->default(0);
            $table->decimal('montant_a_payer', 10, 2)->nullable(); // Pour frais de dossier, etc.
            $table->boolean('obligatoire')->default(true);
            $table->text('description')->nullable();
            $table->boolean('actif')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
