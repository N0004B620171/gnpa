<?php

use App\Http\Controllers\AnneeScolaireController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\EleveController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\NiveauController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ParentEleveController;
use App\Http\Controllers\ProfesseurController;
use App\Http\Controllers\TrimestreController;
use App\Models\ParentEleve;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::resource('eleves', EleveController::class)->parameters([
    'eleves' => 'eleve'
]);

Route::resource('professeurs', ProfesseurController::class);

Route::resource('parent-eleves', ParentEleveController::class)->names('parents');

Route::resource('parent-eleves', ParentEleveController::class);

Route::resource('classes', ClasseController::class);

Route::resource('niveaux', NiveauController::class);

Route::resource('cycles', CycleController::class);
Route::delete('cycles/destroy-multiple', [CycleController::class, 'destroyMultiple'])
    ->name('cycles.destroy-multiple');

Route::resource('annees', AnneeScolaireController::class);

Route::resource('trimestres', TrimestreController::class);

Route::resource('inscriptions', InscriptionController::class);

Route::resource('matieres', MatiereController::class);

Route::resource('notes', NoteController::class);


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
