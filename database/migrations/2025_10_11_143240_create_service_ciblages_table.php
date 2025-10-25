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
         * 🔹 2. SERVICE CIBLAGES
         * Relie un service à un cycle, niveau, classe ou élève spécifique (Inscription)
         */
        Schema::create('service_ciblages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();

            $table->foreignId('service_id')->constrained()->cascadeOnDelete();
            $table->morphs('ciblable'); // ciblable_id + ciblable_type

            $table->timestamps();

            $table->unique(['service_id', 'ciblable_type', 'ciblable_id'], 'service_ciblage_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_ciblages');
    }
};
