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
         * 🔹 4. FACTURE DETAILS
         * Contient les lignes facturées (services) + snapshot complet du service
         */
        Schema::create('facture_details', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();

            $table->foreignId('facture_id')->constrained()->cascadeOnDelete();
            $table->foreignId('service_id')->nullable()->constrained()->nullOnDelete();

            // Snapshot service
            $table->string('service_nom');
            $table->string('service_code')->nullable();
            $table->boolean('service_obligatoire')->default(true);
            $table->text('service_description')->nullable();

            // Montants
            $table->decimal('montant', 10, 2)->default(0);
            $table->decimal('montant_paye', 10, 2)->default(0);
            $table->enum('statut', ['non_paye', 'partiel', 'paye'])->default('non_paye');

            $table->timestamps();
            $table->index(['facture_id', 'service_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facture_details');
    }
};
