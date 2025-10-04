<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('niveau_id')->constrained()->cascadeOnDelete();
            $table->string('nom');
            $table->foreignId('professeur_id')->nullable()->constrained('professeurs')->nullOnDelete();
            $table->timestamps();
            
            $table->unique(['niveau_id', 'nom']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('classes');
    }
};