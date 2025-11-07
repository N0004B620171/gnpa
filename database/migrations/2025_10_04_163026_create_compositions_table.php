<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('compositions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('trimestre_id')->constrained()->cascadeOnDelete();
            $table->foreignId('classe_id')->constrained()->cascadeOnDelete(); // AJOUT IMPORTANT
            $table->string('langue');
            $table->string('nom', 100);
            $table->date('date');   
            $table->boolean('is_controle')->default(false);
            $table->timestamps();
            $table->unique(['trimestre_id', 'classe_id', 'langue']); // Éviter les doublons
            $table->index(['trimestre_id', 'classe_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('compositions');
    }
};
