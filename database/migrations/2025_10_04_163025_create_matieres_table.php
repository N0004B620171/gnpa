<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('nom', 100);
            $table->integer('coefficient')->default(1);
            $table->foreignId('niveau_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('professeur_id')->nullable()->constrained('professeurs')->nullOnDelete();
            $table->timestamps();

            $table->index(['niveau_id', 'nom']);
            $table->index('professeur_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('matieres');
    }
};
