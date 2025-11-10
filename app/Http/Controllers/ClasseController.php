<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use App\Models\Niveau;
use App\Models\Professeur;
use App\Models\Inscription;
use App\Models\ServiceCiblage;
use App\Models\Service;
use App\Models\ItineraireTransport;
use App\Models\Eleve;
use App\Models\ParentEleve;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\ServiceCiblageHelper;
use App\Models\Buse;
use App\Models\InventaireClasse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\IOFactory;
use Illuminate\Support\Facades\DB;

class ClasseController extends Controller
{
    public function index(Request $request)
    {
        $query = Classe::with(['niveau.cycle', 'professeur', 'inscriptions.eleve']);

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nom', 'LIKE', "%{$search}%")
                ->orWhereHas('niveau', function ($q) use ($search) {
                    $q->where('nom', 'LIKE', "%{$search}%")
                        ->orWhereHas('cycle', function ($q2) use ($search) {
                            $q2->where('nom', 'LIKE', "%{$search}%");
                        });
                });
        }

        if ($request->has('niveau_id') && $request->niveau_id != '') {
            $query->where('niveau_id', $request->niveau_id);
        }

        // Nouveau filtre : par cycle
        if ($request->has('cycle_id') && $request->cycle_id != '') {
            $query->whereHas('niveau', function ($q) use ($request) {
                $q->where('cycle_id', $request->cycle_id);
            });
        }

        $perPage = $request->get('perPage', 10);
        $classes = $query->paginate($perPage);

        return Inertia::render('Classes/Index', [
            'classes' => $classes,
            'niveaux' => Niveau::with('cycle')->get(),
            'filters' => [
                'search' => $request->search,
                'niveau_id' => $request->niveau_id,
                'cycle_id' => $request->cycle_id,
                'perPage' => $perPage
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Classes/Create', [
            'niveaux' => Niveau::with('cycle')->get(),
            'professeurs' => Professeur::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:10',
            'niveau_id' => 'required|exists:niveaux,id',
            'professeur_id' => 'nullable|exists:professeurs,id',
            'capacite' => 'required|integer|min:1'
        ]);

        // Vérifier l'unicité nom + niveau
        $existe = Classe::where('niveau_id', $request->niveau_id)
            ->where('nom', $request->nom)
            ->exists();

        if ($existe) {
            return redirect()->back()
                ->with('error', 'Une classe avec ce nom existe déjà dans ce niveau')
                ->withInput();
        }

        Classe::create($request->all());

        return redirect()->route('classes.index')
            ->with('success', 'Classe créée avec succès');
    }

    public function show($id)
    {
        $classe = Classe::with([
            'niveau.cycle',
            'professeur',
            'compositions',
            'inscriptions.eleve.parentEleve',
            'inscriptions.affectationTransport.itineraireTransport.bus',
            'inscriptions.factures',
            'inventaireClasses.materiel'

        ])->findOrFail($id);

        // Récupérer l'inventaire de la classe
        $inventaires = InventaireClasse::with(['materiel'])
            ->where('classe_id', $id)
            ->get();

        // Récupérer les élèves actifs avec leurs relations
        $eleves = $classe->inscriptions()
            ->with([
                'eleve.parentEleve',
                'affectationTransport.itineraireTransport.bus',
                'factures'
            ])
            ->where('statut', 'actif')
            ->get()
            ->pluck('eleve');

        // Extraire les factures de toutes les inscriptions
        $factures = $classe->inscriptions()
            ->where('statut', 'actif')
            ->with('factures')
            ->get()
            ->pluck('factures')
            ->flatten()
            ->sortByDesc('created_at')
            ->values();

        // Récupérer les services appliqués à cette classe
        $serviceCiblages = ServiceCiblage::with(['service'])
            ->where('ciblable_type', 'App\\Models\\Classe')
            ->where('ciblable_id', $id)
            ->get();

        // Récupérer tous les services disponibles
        $services = Service::where('actif', true)->get();

        // Extraire les affectations de transport
        $affectationsTransport = $classe->inscriptions()
            ->where('statut', 'actif')
            ->with('affectationTransport.itineraireTransport.bus')
            ->get()
            ->pluck('affectationTransport')
            ->filter()
            ->values();

        // Récupérer les bus utilisés par la classe (méthode simplifiée)
        $busIds = [];
        foreach ($affectationsTransport as $affectation) {
            if ($affectation && $affectation->itineraireTransport && $affectation->itineraireTransport->bus) {
                $busIds[] = $affectation->itineraireTransport->bus->id;
            }
        }
        $busUtilises = Buse::whereIn('id', array_unique($busIds))->get();

        // Récupérer tous les itinéraires disponibles
        $itineraires = ItineraireTransport::with(['bus', 'arrets'])->get();

        // Récupérer les années scolaires actives
        $anneesScolaires = AnneeScolaire::where('actif', true)->get();

        return Inertia::render('Classes/Show', [
            'classe' => $classe,
            'eleves' => $eleves,
            'factures' => $factures,
            'serviceCiblages' => $serviceCiblages,
            'services' => $services,
            'affectationsTransport' => $affectationsTransport,
            'busUtilises' => $busUtilises,
            'itineraires' => $itineraires,
            'anneesScolaires' => $anneesScolaires,
            'inventaires' => $inventaires
        ]);
    }

    /**
     * 🔗 Associer un service à la classe
     */
    public function associerService(Request $request, Classe $classe)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $resultat = ServiceCiblageHelper::associerService(
            $request->service_id,
            Classe::class,
            $classe->id
        );

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * ❌ Dissocier un service de la classe
     */
    public function dissocierService(ServiceCiblage $serviceCiblage)
    {
        $resultat = ServiceCiblageHelper::dissocierService($serviceCiblage);

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * 📋 Importer des élèves depuis un fichier Excel
     */
    public function importerEleves(Request $request, Classe $classe)
    {
        $request->validate([
            'fichier_excel' => 'required|file|mimes:xlsx,xls,csv|max:10240', // 10MB max
            'annee_scolaire_id' => 'required|exists:annee_scolaires,id',
            'creer_parents' => 'boolean'
        ]);

        DB::beginTransaction();
        try {
            $fichier = $request->file('fichier_excel');
            $anneeScolaireId = $request->annee_scolaire_id;
            $creerParents = $request->boolean('creer_parents', true);

            // Charger le fichier Excel
            $spreadsheet = IOFactory::load($fichier->getPathname());
            $worksheet = $spreadsheet->getActiveSheet();
            $lignes = $worksheet->toArray();

            $elevesCrees = 0;
            $erreurs = [];

            // Vérifier que le fichier a le bon format
            $entetesAttendus = ['Prénom élève', 'Nom élève', 'Date de naissance', 'Sexe', 'Prénom parent', 'Nom parent', 'Email parent', 'Téléphone parent'];
            $entetesFichier = array_slice($lignes[0], 0, 8);

            if ($entetesFichier !== $entetesAttendus) {
                return redirect()->back()
                    ->with('error', 'Le format du fichier est incorrect. Veuillez utiliser le modèle fourni.')
                    ->withInput();
            }

            // Ignorer l'en-tête (première ligne)
            array_shift($lignes);

            foreach ($lignes as $index => $ligne) {
                $numeroLigne = $index + 2; // +2 car on ignore l'en-tête et index commence à 0

                // Ignorer les lignes vides
                if (empty(array_filter($ligne))) {
                    continue;
                }

                try {
                    // Validation des données minimales
                    if (empty($ligne[0]) || empty($ligne[1])) {
                        $erreurs[] = "Ligne {$numeroLigne}: Prénom et nom de l'élève requis";
                        continue;
                    }

                    $prenomEleve = trim($ligne[0]);
                    $nomEleve = trim($ligne[1]);
                    $dateNaissance = !empty($ligne[2]) ? $this->convertirDateExcel($ligne[2]) : null;
                    $sexe = !empty($ligne[3]) ? strtoupper(trim($ligne[3])) : null;
                    $prenomParent = !empty($ligne[4]) ? trim($ligne[4]) : null;
                    $nomParent = !empty($ligne[5]) ? trim($ligne[5]) : null;
                    $emailParent = !empty($ligne[6]) ? trim($ligne[6]) : null;
                    $telephoneParent = !empty($ligne[7]) ? trim($ligne[7]) : null;

                    // Validation du sexe
                    if ($sexe && !in_array($sexe, ['M', 'F'])) {
                        $erreurs[] = "Ligne {$numeroLigne}: Sexe invalide (doit être M ou F)";
                        continue;
                    }

                    $parentId = null;

                    // Gestion du parent
                    if ($prenomParent && $nomParent && $creerParents) {
                        $critere = [];
                        if ($emailParent) {
                            $critere['email'] = $emailParent;
                        } else {
                            // Si pas d'email, utiliser la combinaison prénom + nom
                            $critere = [
                                'prenom' => $prenomParent,
                                'nom' => $nomParent
                            ];
                        }

                        $parent = ParentEleve::firstOrCreate(
                            $critere,
                            [
                                'prenom' => $prenomParent,
                                'nom' => $nomParent,
                                'telephone' => $telephoneParent,
                                'email' => $emailParent,
                                'adresse' => null,
                                'creer_compte' => false
                            ]
                        );
                        $parentId = $parent->id;
                    }

                    // Vérifier si l'élève existe déjà (même prénom + nom)
                    $eleveExiste = Eleve::where('prenom', $prenomEleve)
                        ->where('nom', $nomEleve)
                        ->exists();

                    if ($eleveExiste) {
                        $erreurs[] = "Ligne {$numeroLigne}: L'élève {$prenomEleve} {$nomEleve} existe déjà";
                        continue;
                    }

                    // Création de l'élève
                    $eleve = Eleve::create([
                        'prenom' => $prenomEleve,
                        'nom' => $nomEleve,
                        'date_naissance' => $dateNaissance,
                        'sexe' => $sexe,
                        'photo' => null,
                        'parent_eleve_id' => $parentId
                    ]);

                    // Vérifier si l'élève est déjà inscrit dans cette classe cette année
                    $inscriptionExiste = Inscription::where('eleve_id', $eleve->id)
                        ->where('annee_scolaire_id', $anneeScolaireId)
                        ->where('classe_id', $classe->id)
                        ->exists();

                    if (!$inscriptionExiste) {
                        // Inscription de l'élève dans la classe
                        Inscription::create([
                            'uid' => Str::uuid(),
                            'eleve_id' => $eleve->id,
                            'classe_id' => $classe->id,
                            'annee_scolaire_id' => $anneeScolaireId,
                            'statut' => 'actif',
                            'date_inscription' => now()
                        ]);
                    }

                    $elevesCrees++;
                } catch (\Exception $e) {
                    $erreurs[] = "Ligne {$numeroLigne}: " . $e->getMessage();
                    continue;
                }
            }

            DB::commit();

            $message = "✅ {$elevesCrees} élève(s) importé(s) avec succès dans la classe {$classe->nom}.";
            if (!empty($erreurs)) {
                $message .= " \n\n❌ Erreurs rencontrées : \n" . implode('\n', array_slice($erreurs, 0, 10));
                if (count($erreurs) > 10) {
                    $message .= "\n... et " . (count($erreurs) - 10) . " autres erreurs";
                }
            }

            return redirect()->back()
                ->with('success', $message)
                ->with('erreurs_import', $erreurs);
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Erreur lors de l\'import: ' . $e->getMessage());
        }
    }
    /**
     * Convertir les dates Excel en format MySQL
     */
    private function convertirDateExcel($date)
    {
        if (is_numeric($date)) {
            // Date Excel (nombre de jours depuis 1900)
            return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($date)
                ->format('Y-m-d');
        }

        // Essayer différents formats de date
        $formats = ['d/m/Y', 'd-m-Y', 'Y-m-d', 'm/d/Y'];
        foreach ($formats as $format) {
            $dateObj = \DateTime::createFromFormat($format, $date);
            if ($dateObj !== false) {
                return $dateObj->format('Y-m-d');
            }
        }

        return null;
    }

    public function edit($id)
    {
        $classe = Classe::findOrFail($id);


        return Inertia::render('Classes/Edit', [
            'classe' => $classe,
            'niveaux' => Niveau::with('cycle')->get(),
            'professeurs' => Professeur::all()
        ]);
    }

    public function update(Request $request, $id)
    {
        $classe = Classe::findOrFail($id);
        $request->validate([
            'nom' => 'required|string|max:10',
            'niveau_id' => 'required|exists:niveaux,id',
            'professeur_id' => 'nullable|exists:professeurs,id',
            'capacite' => 'required|integer|min:1'
        ]);

        // Vérifier l'unicité nom + niveau
        $existe = Classe::where('niveau_id', $request->niveau_id)
            ->where('nom', $request->nom)
            ->where('id', '!=', $classe->id)
            ->exists();

        if ($existe) {
            return redirect()->back()
                ->with('error', 'Une classe avec ce nom existe déjà dans ce niveau')
                ->withInput();
        }

        $classe->update($request->all());

        return redirect()->route('classes.index')
            ->with('success', 'Classe mise à jour avec succès');
    }

    public function destroy($id)
    {
        $classe = Classe::findOrFail($id);
        if ($classe->inscriptions()->where('statut', 'actif')->exists()) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer cette classe car elle contient des élèves actifs');
        }

        $classe->delete();

        return redirect()->route('classes.index')
            ->with('success', 'Classe supprimée avec succès');
    }

    public function statistiques(Classe $classe)
    {
        $totalEleves = $classe->inscriptions()->where('statut', 'actif')->count();
        $garcons = $classe->inscriptions()
            ->where('statut', 'actif')
            ->whereHas('eleve', function ($query) {
                $query->where('sexe', 'M');
            })->count();
        $filles = $totalEleves - $garcons;

        return Inertia::render('Classes/Statistiques', [
            'classe' => $classe->load('niveau.cycle'),
            'statistiques' => [
                'total_eleves' => $totalEleves,
                'garcons' => $garcons,
                'filles' => $filles,
                'taux_remplissage' => round(($totalEleves / $classe->capacite) * 100, 2)
            ]
        ]);
    }
}
