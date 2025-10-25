<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('inscription_id')->constrained()->cascadeOnDelete();
            $table->foreignId('composition_id')->constrained()->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained()->cascadeOnDelete();
            $table->decimal('note', 5, 2);
            $table->decimal('sur', 5, 2)->default(10.00);
            $table->text('appreciation')->nullable();
            $table->timestamps();

            $table->unique(['inscription_id', 'composition_id', 'matiere_id'], 'note_unique');
            $table->index(['matiere_id', 'composition_id']);
            $table->index('note');
        });
    }

    public function down()
    {
        Schema::dropIfExists('notes');
    }
};
