<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('cycles', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('nom');
            $table->decimal('bareme', 5, 2)->default(10);
            $table->unsignedTinyInteger('nombre_trimestres')->default(3); // 2 ou 3 selon le cycle
            $table->enum('systeme', ['standard', 'bilingue', 'trilingue'])->default('standard');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('cycles');
    }
};
