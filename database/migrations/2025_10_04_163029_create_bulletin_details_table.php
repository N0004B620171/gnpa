<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bulletin_details', function (Blueprint $table) {
            $table->id();
            $table->uuid('uid')->unique();
            $table->foreignId('bulletin_id')->constrained()->cascadeOnDelete();
            $table->foreignId('matiere_id')->nullable()->constrained()->nullOnDelete();

            // Archives matière & prof
            $table->string('matiere_nom');
            $table->integer('coefficient')->default(1);
            $table->string('professeur_nom')->nullable();

            // Notes
            $table->float('note');
            $table->float('sur');
            $table->float('note_normalisee');
            $table->string('appreciation')->nullable();

            $table->timestamps();
            
            $table->index(['bulletin_id', 'matiere_id'], 'bulletin_details_bulletin_matiere_index');
        });
    }

    public function down()
    {
        Schema::dropIfExists('bulletin_details');
    }
};