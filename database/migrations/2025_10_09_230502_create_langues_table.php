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
        Schema::create('langues', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->string('code', 5)->unique(); // ex: FR, EN, AR, ES
            $table->string('nom', 50);           // ex: Français, Anglais, Arabe
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('langues');
    }
};
