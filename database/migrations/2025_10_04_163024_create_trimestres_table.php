<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('trimestres', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('annee_scolaire_id')->constrained()->cascadeOnDelete();
            $table->foreignId('cycle_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedTinyInteger('numero');
            $table->string('nom');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->decimal('bareme', 5, 2)->default(10);

            $table->boolean('is_active')->default(true); // ✅ pour ignorer les trimestres restants
            $table->boolean('mark_as_last')->default(false); // ✅ pour marquer le dernier trimestre actif

            $table->timestamps();

            $table->unique(['annee_scolaire_id', 'cycle_id', 'numero']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('trimestres');
    }
};
