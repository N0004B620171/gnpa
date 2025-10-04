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
            $table->unsignedTinyInteger('numero');
            $table->string('nom');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->float('bareme')->default(20);
            $table->timestamps();
            
            $table->unique(['annee_scolaire_id', 'numero']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('trimestres');
    }
};