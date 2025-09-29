<?php

use App\Http\Controllers\EleveController;
use App\Http\Controllers\ParentEleveController;
use App\Http\Controllers\ProfesseurController;
use App\Models\ParentEleve;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');
Route::resource('eleves', EleveController::class)->parameters([
    'eleves' => 'eleve'
]);

Route::resource('professeurs',ProfesseurController::class);
Route::resource('parent-eleves',ParentEleveController::class);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
