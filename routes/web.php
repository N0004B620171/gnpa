<?php

use App\Http\Controllers\AnneeScolaireController;
use App\Http\Controllers\BulletinController;
use App\Http\Controllers\BulletinDetailController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\CompositionController;
use App\Http\Controllers\CycleController;
use App\Http\Controllers\EleveController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\MatiereController;
use App\Http\Controllers\NiveauController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\ParentEleveController;
use App\Http\Controllers\ProfesseurController;
use App\Http\Controllers\TrimestreController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceCiblageController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\PaiementController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\ItineraireTransportController;
use App\Http\Controllers\ArretController;
use App\Http\Controllers\AffectationTransportController;
use App\Http\Controllers\HistoriqueTransfertController;
use App\Http\Controllers\InventaireClasseController;
use App\Http\Controllers\InventaireEnseignantController;
use App\Http\Controllers\MaterielController;
use App\Http\Controllers\ModeleExcelController;
use App\Http\Controllers\TransfertAnneeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Route de fallback pour SPA
Route::fallback(function () {
    return Inertia::render('Welcome');
});


// Routes publiques (si nécessaire)
Route::resource('eleves', EleveController::class)->parameters([
    'eleves' => 'eleve'
]);

Route::resource('professeurs', ProfesseurController::class);

Route::resource('parents', ParentEleveController::class);

Route::resource('classes', ClasseController::class);
// Routes pour l'import Excel
Route::post('/classes/{classe}/importer-eleves', [ClasseController::class, 'importerEleves'])
    ->name('classes.importer-eleves');

Route::get('/api/telecharger-modele-excel', [ModeleExcelController::class, 'telechargerModeleEleves'])
    ->name('api.telecharger-modele-excel');

Route::resource('niveaux', NiveauController::class);

Route::resource('materiels', MaterielController::class);
Route::resource('inventaires-classes', InventaireClasseController::class);
Route::resource('inventaires-enseignants', InventaireEnseignantController::class);

// routes/web.php
Route::prefix('transfert')->group(function () {
    Route::get('/', [TransfertAnneeController::class, 'index'])->name('transfert.index');
    Route::post('/transferer', [TransfertAnneeController::class, 'transferer'])->name('transfert.transferer');
    Route::post('/annuler/{id}', [TransfertAnneeController::class, 'annuler'])->name('transfert.annuler');
});

Route::prefix('historique-transferts')->group(function () {
    Route::get('/', [HistoriqueTransfertController::class, 'index'])->name('historique-transferts.index');
    Route::get('/{historiqueTransfert}', [HistoriqueTransfertController::class, 'show'])->name('historique-transferts.show');
    Route::post('/annuler/{id}', [HistoriqueTransfertController::class, 'annuler'])->name('historique-transferts.annuler');
});

Route::resource('cycles', CycleController::class);
Route::get('/cycles/stats', [CycleController::class, 'stats'])->name('cycles.stats');

Route::resource('annees-scolaires', AnneeScolaireController::class);
Route::post('/annees-scolaires/{anneeScolaire}/activer', [AnneeScolaireController::class, 'activer'])->name('annees-scolaires.activer');

Route::resource('trimestres', TrimestreController::class);

Route::resource('inscriptions', InscriptionController::class);

// Routes pour les matières
Route::resource('matieres', MatiereController::class);
Route::post('/matieres/{matiere}/attach-composition', [MatiereController::class, 'attachComposition'])
    ->name('matieres.attach-composition');
Route::delete('/matieres/{matiere}/detach-composition/{compositionId}', [MatiereController::class, 'detachComposition'])
    ->name('matieres.detach-composition');
Route::get('/matieres/{matiere}/compositions', [MatiereController::class, 'getCompositions'])
    ->name('matieres.compositions');

// Routes pour les compositions
// routes/web.php
Route::resource('compositions', CompositionController::class);
Route::post('/compositions/{composition}/attach-matiere', [CompositionController::class, 'attachMatiere']);
Route::delete('/compositions/{composition}/detach-matiere/{matiereId}', [CompositionController::class, 'detachMatiere']);

// Routes pour les notes
// Routes pour les notes
Route::resource('notes', NoteController::class);

// Routes supplémentaires pour la saisie groupée
Route::get('/notes/multiple/create', [NoteController::class, 'createMultiple'])->name('notes.multiple.create');
Route::post('/notes/multiple', [NoteController::class, 'storeMultiple'])->name('notes.multiple.store');
Route::get('/notes/composition-data/{composition}', [NoteController::class, 'getCompositionData'])->name('notes.composition.data');



// Routes pour les bulletins
Route::get('/bulletins', [BulletinController::class, 'index'])->name('bulletins.index');
Route::get('/bulletins/create', [BulletinController::class, 'create'])->name('bulletins.create');
Route::post('/bulletins', [BulletinController::class, 'store'])->name('bulletins.store');
Route::get('/bulletins/{bulletin}', [BulletinController::class, 'show'])->name('bulletins.show');
Route::get('/bulletins/{bulletin}/edit', [BulletinController::class, 'edit'])->name('bulletins.edit');
Route::put('/bulletins/{bulletin}', [BulletinController::class, 'update'])->name('bulletins.update');
Route::delete('/bulletins/{bulletin}', [BulletinController::class, 'destroy'])->name('bulletins.destroy');

// Routes spéciales pour les bulletins
Route::post('/bulletins/bulk-generate', [BulletinController::class, 'bulkGenerate'])->name('bulletins.bulk-generate');
Route::post('/bulletins/{inscription}/trimestre', [BulletinController::class, 'generateTrimestre'])->name('bulletins.generate-trimestre');
Route::post('/bulletins/{inscription}/annuel', [BulletinController::class, 'generateAnnuel'])->name('bulletins.generate-annuel');
Route::get('/bulletins/{bulletin}/download', [BulletinController::class, 'download'])->name('bulletins.download');

// Routes pour les détails de bulletins
Route::put('/bulletin-details/{bulletinDetail}', [BulletinDetailController::class, 'update'])->name('bulletin-details.update');
Route::put('/bulletin-details/bulk-update', [BulletinDetailController::class, 'bulkUpdate'])->name('bulletin-details.bulk-update');
Route::delete('/bulletin-details/{bulletinDetail}', [BulletinDetailController::class, 'destroy'])->name('bulletin-details.destroy');

// Services
Route::resource('services', ServiceController::class)->except(['show']);

Route::resource('service-ciblages', ServiceCiblageController::class);

// Route::get('service-ciblages', [ServiceCiblageController::class, 'index'])->name('services.ciblages.index');
// Route::post('service-ciblages', [ServiceCiblageController::class, 'store'])->name('services.ciblages.store');
// Route::delete('service-ciblages/{serviceCiblage}', [ServiceCiblageController::class, 'destroy'])->name('services.ciblages.destroy');

// Factures
Route::get('factures', [FactureController::class, 'index'])->name('factures.index');
Route::get('factures/{facture}', [FactureController::class, 'show'])->name('factures.show');
Route::post('inscriptions/{inscription}/factures/generate', [FactureController::class, 'generateMensuelle'])->name('factures.generate.mensuelle');
Route::post('inscriptions/{inscription}/factures/regenerate-annee', [FactureController::class, 'regenerateAnnee'])->name('factures.regenerate.annee');


// Routes pour l'association des services aux inscriptions
Route::post('/inscriptions/{inscription}/associer-service', [InscriptionController::class, 'associerService'])
    ->name('inscriptions.associer-service');
Route::delete('/service-ciblages/{serviceCiblage}', [InscriptionController::class, 'dissocierService'])
    ->name('service-ciblages.destroy');


// Routes pour les services des classes
Route::post('/classes/{classe}/associer-service', [ClasseController::class, 'associerService'])->name('classes.associer-service');
Route::delete('/service-ciblages/{serviceCiblage}', [ClasseController::class, 'dissocierService'])->name('classes.dissocier-service');

// Routes pour les services des niveaux
Route::post('/niveaux/{niveau}/associer-service', [NiveauController::class, 'associerService'])->name('niveaux.associer-service');
Route::delete('/service-ciblages/{serviceCiblage}', [NiveauController::class, 'dissocierService'])->name('niveaux.dissocier-service');
// Paiements

// Ancienne logique : Les paiements sont liés aux factures
Route::get('/factures/{facture}/paiements/create', [PaiementController::class, 'create'])->name('paiements.create');
Route::post('/factures/{facture}/paiements', [PaiementController::class, 'store'])->name('paiements.store');

// Transport
Route::resource('buses', BusController::class)->except(['show']);
Route::resource('itineraires-transports', ItineraireTransportController::class);

// Arrêts imbriqués
// routes/web.php
Route::get('/itineraires-transports/{itineraire}/arrets', [ArretController::class, 'index'])
    ->name('itineraires-transports.arrets.index');

Route::post('itineraires/{itineraire}/arrets', [ArretController::class, 'store'])->name('arrets.store');
Route::put('itineraires/{itineraire}/arrets/{arret}', [ArretController::class, 'update'])->name('arrets.update');
Route::delete('itineraires/{itineraire}/arrets/{arret}', [ArretController::class, 'destroy'])->name('arrets.destroy');

// Affectations transport



Route::resource('affectations-transports', AffectationTransportController::class);

// Route::get('transports-affectations', [AffectationTransportController::class, 'index'])->name('affectations.index');
// Route::post('transports-affectations', [AffectationTransportController::class, 'store'])->name('affectations.store');
// Route::put('transports-affectations/{affectation}', [AffectationTransportController::class, 'update'])->name('affectations.update');
// Route::delete('transports-affectations/{affectation}', [AffectationTransportController::class, 'destroy'])->name('affectations.destroy');



Route::get('dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

// Routes protégées par authentification
Route::middleware(['auth', 'verified'])->group(function () {


    // Vous pouvez déplacer ici les routes qui nécessitent une authentification
    // Par exemple :
    // Route::resource('notes', NoteController::class);
    // Route::resource('compositions', CompositionController::class);
    // etc.
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
