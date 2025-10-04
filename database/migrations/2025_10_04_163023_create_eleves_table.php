<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('prenom', 100);
            $table->string('nom', 100);
            $table->date('date_naissance')->nullable();
            $table->enum('sexe', ['M', 'F'])->nullable();
            $table->string('photo')->nullable();
            $table->foreignId('parent_eleve_id')->nullable()->constrained('parent_eleves')->nullOnDelete();
            $table->timestamps();
            
            $table->index(['nom', 'prenom']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('eleves');
    }
};