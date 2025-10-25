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
         * 🔹 6. PAIEMENTS
         * Chaque versement effectué (trace complète)
         */
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();

            $table->foreignId('facture_id')->constrained()->cascadeOnDelete();
            $table->foreignId('facture_detail_id')->nullable()->constrained()->nullOnDelete();

            // Montant & infos
            $table->decimal('montant', 10, 2);
            $table->dateTime('date_paiement')->default(now());
            $table->string('mode_paiement')->default('espèces');
            $table->string('reference_transaction')->nullable();

            // Traçabilité
            $table->string('numero_recu')->nullable();
            $table->string('effectue_par')->nullable(); // parent / élève
            $table->string('caissier_nom')->nullable();
            $table->string('poste_encaissement')->nullable();        
            $table->text('note')->nullable();

            $table->timestamps();

            $table->index(['facture_id', 'facture_detail_id', 'date_paiement']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
