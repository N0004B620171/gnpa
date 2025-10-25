<?php

namespace App\Http\Controllers;

use App\Models\AnneeScolaire;
use App\Models\Cycle;
use App\Models\Trimestre;
use App\Models\Composition;
use App\Models\Bulletin;
use App\Models\Classe;
use App\Models\Inscription;
use App\Models\Service;
use App\Models\ServiceCiblage;
use App\Helpers\ServiceCiblageHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class AnneeScolaireController extends Controller
{
    // 🔹 Liste des années scolaires
    public function index(Request $request)
    {
        $query = AnneeScolaire::withCount(['trimestres', 'inscriptions']);

        if ($request->filled('search')) {
            $query->where('nom', 'LIKE', "%{$request->search}%");
        }

        // Filtre par statut
        if ($request->filled('statut')) {
            $query->where('actif', $request->statut === 'actif');
        }

        // Filtre par période
        if ($request->filled('periode')) {
            $now = Carbon::now();
            switch ($request->periode) {
                case 'passees':
                    $query->where('date_fin', '<', $now);
                    break;
                case 'courantes':
                    $query->where('date_debut', '<=', $now)
                        ->where('date_fin', '>=', $now);
                    break;
                case 'futures':
                    $query->where('date_debut', '>', $now);
                    break;
            }
        }

        $annees = $query->orderByDesc('actif')
            ->orderByDesc('date_debut')
            ->paginate($request->get('perPage', 10))
            ->withQueryString();

        return Inertia::render('AnneeScolaires/Index', [
            'annees' => $annees,
            'filters' => $request->only(['search', 'statut', 'periode', 'perPage']),
            'stats' => [
                'total' => AnneeScolaire::count(),
                'actives' => AnneeScolaire::where('actif', true)->count(),
                'avec_inscriptions' => AnneeScolaire::has('inscriptions')->count(),
                'passees' => AnneeScolaire::where('date_fin', '<', Carbon::now())->count(),
                'futures' => AnneeScolaire::where('date_debut', '>', Carbon::now())->count(),
            ]
        ]);
    }

    // 🔹 Page de création
    public function create()
    {
        return Inertia::render('AnneeScolaires/Create', [
            'suggestions' => [
                'nom' => $this->genererNomsSuggestions(),
                'prochaine_date_debut' => Carbon::now()->startOfMonth()->addMonth()->format('Y-m-d'),
                'prochaine_date_fin' => Carbon::now()->startOfMonth()->addMonth()->addYear()->subDay()->format('Y-m-d')
            ],
            'cycles' => Cycle::with('langues:id,code,nom')->get(['id', 'nom', 'systeme', 'nombre_trimestres'])
        ]);
    }

    // 🔹 Création d'une année scolaire avec génération automatique
    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:100|unique:annee_scolaires,nom',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'actif' => 'boolean',
            'description' => 'nullable|string|max:500',
            'cycles' => 'required|array|min:1',
            'cycles.*' => 'exists:cycles,id'
        ], [
            'cycles.required' => 'Veuillez sélectionner au moins un cycle.',
            'date_fin.after' => 'La date de fin doit être postérieure à la date de début.'
        ]);

        $dateDebut = Carbon::parse($request->date_debut);
        $dateFin = Carbon::parse($request->date_fin);
        $dureeMois = $dateDebut->diffInMonths($dateFin);

        // Validation de la durée
        if ($dureeMois < 8) {
            return back()->withErrors([
                'date_fin' => 'La durée de l\'année scolaire doit être d\'au moins 8 mois'
            ])->withInput();
        }

        // Vérification des chevauchements
        $chevauchante = AnneeScolaire::where(function ($query) use ($request) {
            $query->whereBetween('date_debut', [$request->date_debut, $request->date_fin])
                ->orWhereBetween('date_fin', [$request->date_debut, $request->date_fin])
                ->orWhere(function ($q) use ($request) {
                    $q->where('date_debut', '<=', $request->date_debut)
                        ->where('date_fin', '>=', $request->date_fin);
                });
        })->exists();

        if ($chevauchante) {
            return back()->withErrors([
                'date_debut' => 'Cette période chevauche une année scolaire existante',
                'date_fin' => 'Cette période chevauche une année scolaire existante'
            ])->withInput();
        }

        DB::beginTransaction();
        try {
            // Désactiver les autres années si celle-ci est active
            if ($request->boolean('actif')) {
                AnneeScolaire::where('actif', true)->update(['actif' => false]);
            }

            // Création de l'année scolaire
            $annee = AnneeScolaire::create([
                'nom' => $request->nom,
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'actif' => $request->boolean('actif'),
                'description' => $request->description
            ]);

            // Génération automatique des trimestres
            foreach ($request->cycles as $cycleId) {
                $cycle = Cycle::with('langues')->findOrFail($cycleId);
                $this->creerTrimestresSelonCycle($annee, $cycle);
            }

            DB::commit();

            return redirect()->route('annees-scolaires.index')
                ->with('success', 'Année scolaire créée avec succès. ' .
                    count($request->cycles) . ' cycle(s) et leurs trimestres ont été générés automatiquement.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur création année scolaire', [
                'erreur' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Une erreur est survenue lors de la création: ' . $e->getMessage())->withInput();
        }
    }

    // 🔹 Création automatique des trimestres selon le cycle
    /**
     * 🔹 Création automatique des trimestres selon le cycle et les langues associées
     */
    private function creerTrimestresSelonCycle(AnneeScolaire $annee, Cycle $cycle)
    {
        $dateDebut = Carbon::parse($annee->date_debut);
        $dateFin = Carbon::parse($annee->date_fin);
        $dureeMois = $dateDebut->diffInMonths($dateFin);
        $moisParTrimestre = floor($dureeMois / $cycle->nombre_trimestres);

        // 🔸 Si le cycle n’a pas de langues associées, on crée une entrée "Standard"
        $langues = $cycle->langues->count() > 0 ? $cycle->langues : collect([(object)['id' => null, 'nom' => 'Standard']]);

        foreach ($langues as $langue) {
            for ($i = 1; $i <= $cycle->nombre_trimestres; $i++) {
                $start = $dateDebut->copy()->addMonths($moisParTrimestre * ($i - 1));
                $end = $i === $cycle->nombre_trimestres
                    ? $dateFin
                    : $start->copy()->addMonths($moisParTrimestre)->subDay();

                // 🔹 Ajustement pour éviter chevauchement
                if ($i > 1) {
                    $start = $start->addDay();
                }

                // 🔹 Construction du nom clair
                $numeroLibelle = match ($i) {
                    1 => '1er',
                    2 => '2ème',
                    3 => '3ème',
                    default => "{$i}ème"
                };

                $nomTrimestre = "{$numeroLibelle} Trimestre {$langue->nom} — Cycle {$cycle->nom}";

                // 🔹 Création du trimestre
                $trimestre = $annee->trimestres()->create([
                    'cycle_id' => $cycle->id,
                    'langue_id' => $langue->id,
                    'numero' => $i,
                    'nom' => $nomTrimestre,
                    'date_debut' => $start->format('Y-m-d'),
                    'date_fin' => $end->format('Y-m-d'),
                    'bareme' => $cycle->bareme ?? 10,
                    'is_active' => true,
                ]);

                // 🔹 Journalisation
                Log::info("✅ Trimestre créé avec succès", [
                    'annee' => $annee->nom,
                    'cycle' => $cycle->nom,
                    'langue' => $langue->nom,
                    'trimestre' => $nomTrimestre,
                    'période' => "{$start->format('Y-m-d')} → {$end->format('Y-m-d')}",
                ]);
            }
        }
    }


    // 🔹 Affichage d'une année scolaire
    public function show($id)
    {
        $annee = AnneeScolaire::with([
            'trimestres' => function ($query) {
                $query->orderBy('numero');
            },
            'trimestres.cycle.langues',
            'inscriptions.eleve.parentEleve',
            'inscriptions.classe.niveau.cycle',
            'inscriptions.factures',
            'inscriptions.affectationTransport.itineraireTransport.bus',
            'inscriptions.affectationTransport.itineraireTransport.service',
            'inscriptions.affectationTransport.arret',
            'inscriptions.bulletins'
        ])->findOrFail($id);

        // Charger les services ciblages existants pour cette année scolaire
        $serviceCiblages = ServiceCiblage::with(['service'])
            ->where('ciblable_type', 'App\\Models\\AnneeScolaire')
            ->where('ciblable_id', $annee->id)
            ->get();

        // Charger tous les services disponibles
        $services = Service::where('actif', true)->get();

        $stats = [
            'total_inscriptions' => $annee->inscriptions->count(),
            'inscriptions_actives' => $annee->inscriptions->where('statut', 'actif')->count(),
            'nombre_classes' => $annee->inscriptions->pluck('classe_id')->unique()->count(),
            'nombre_niveaux' => $annee->inscriptions->pluck('classe.niveau_id')->unique()->count(),
            'trimestres_count' => $annee->trimestres->count(),
            'total_factures' => $annee->inscriptions->sum(function ($inscription) {
                return $inscription->factures->count();
            }),
            'factures_payees' => $annee->inscriptions->sum(function ($inscription) {
                return $inscription->factures->where('statut', 'paye')->count();
            }),
            'total_eleves_transport' => $annee->inscriptions->where('affectationTransport.actif', true)->count(),
        ];

        // Statistiques des bus
        $busStats = $this->getBusStats($annee);

        return Inertia::render('AnneeScolaires/Show', [
            'annee' => $annee,
            'serviceCiblages' => $serviceCiblages,
            'services' => $services,
            'statistiques' => $stats,
            'busStats' => $busStats,
            'progression' => $this->calculerProgression($annee)
        ]);
    }

    /**
     * 🔗 Associer un service à l'année scolaire
     */
    public function associerService(Request $request, AnneeScolaire $anneeScolaire)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $resultat = ServiceCiblageHelper::associerService(
            $request->service_id,
            AnneeScolaire::class,
            $anneeScolaire->id
        );

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * ❌ Dissocier un service de l'année scolaire
     */
    public function dissocierService(ServiceCiblage $serviceCiblage)
    {
        $resultat = ServiceCiblageHelper::dissocierService($serviceCiblage);

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * 📊 Obtenir les statistiques des bus pour l'année scolaire
     */
    private function getBusStats(AnneeScolaire $annee)
    {
        $busUtilises = [];
        $totalElevesTransport = 0;

        foreach ($annee->inscriptions as $inscription) {
            if (
                $inscription->affectationTransport &&
                $inscription->affectationTransport->actif &&
                $inscription->affectationTransport->itineraireTransport->bus
            ) {

                $bus = $inscription->affectationTransport->itineraireTransport->bus;
                $busId = $bus->id;

                if (!isset($busUtilises[$busId])) {
                    $busUtilises[$busId] = [
                        'bus' => $bus,
                        'count' => 0,
                        'itineraires' => []
                    ];
                }

                $busUtilises[$busId]['count']++;
                $itineraireId = $inscription->affectationTransport->itineraire_transport_id;

                if (!in_array($itineraireId, $busUtilises[$busId]['itineraires'])) {
                    $busUtilises[$busId]['itineraires'][] = $itineraireId;
                }

                $totalElevesTransport++;
            }
        }

        return [
            'busUtilises' => array_values($busUtilises),
            'totalBus' => count($busUtilises),
            'totalElevesTransport' => $totalElevesTransport,
            'totalItineraires' => array_sum(array_map(function ($bus) {
                return count($bus['itineraires']);
            }, $busUtilises))
        ];
    }

    // 🔹 Édition d'une année scolaire
    public function edit($id)
    {
        $annee = AnneeScolaire::with(['trimestres' => function ($query) {
            $query->orderBy('numero');
        }])->findOrFail($id);

        $annee_actuelle = AnneeScolaire::where('actif', true)->first();

        return Inertia::render('AnneeScolaires/Edit', [
            'annee' => $annee,
            'annee_actuelle' => $annee_actuelle
        ]);
    }

    // 🔹 Mise à jour d'une année scolaire
    public function update(Request $request, $id)
    {
        $annee = AnneeScolaire::findOrFail($id);

        $request->validate([
            'nom' => [
                'required',
                'string',
                'max:100',
                Rule::unique('annee_scolaires')->ignore($annee->id)
            ],
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'actif' => 'boolean',
            'description' => 'nullable|string|max:500'
        ]);

        $dateDebut = Carbon::parse($request->date_debut);
        $dateFin = Carbon::parse($request->date_fin);
        $dureeMois = $dateDebut->diffInMonths($dateFin);

        if ($dureeMois < 8) {
            return back()->withErrors([
                'date_fin' => 'La durée de l\'année scolaire doit être d\'au moins 8 mois'
            ])->withInput();
        }

        // Vérification des chevauchements (exclure l'année courante)
        $chevauchante = AnneeScolaire::where('id', '!=', $annee->id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('date_debut', [$request->date_debut, $request->date_fin])
                    ->orWhereBetween('date_fin', [$request->date_debut, $request->date_fin])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('date_debut', '<=', $request->date_debut)
                            ->where('date_fin', '>=', $request->date_fin);
                    });
            })->exists();

        if ($chevauchante) {
            return back()->withErrors([
                'date_debut' => 'Cette période chevauche une année scolaire existante',
                'date_fin' => 'Cette période chevauche une année scolaire existante'
            ])->withInput();
        }

        DB::beginTransaction();
        try {
            if ($request->boolean('actif')) {
                AnneeScolaire::where('actif', true)->update(['actif' => false]);
            }

            $annee->update([
                'nom' => $request->nom,
                'date_debut' => $request->date_debut,
                'date_fin' => $request->date_fin,
                'actif' => $request->boolean('actif'),
                'description' => $request->description
            ]);

            DB::commit();

            return redirect()->route('annees-scolaires.show', $annee->id)
                ->with('success', 'Année scolaire mise à jour avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur modification année scolaire', [
                'annee_id' => $id,
                'erreur' => $e->getMessage()
            ]);
            return back()->with('error', 'Erreur lors de la mise à jour: ' . $e->getMessage())->withInput();
        }
    }

    // 🔹 Suppression d'une année scolaire
    public function destroy($id)
    {
        $annee = AnneeScolaire::withCount(['trimestres', 'inscriptions'])->findOrFail($id);

        if ($annee->actif) {
            return back()->with('error', 'Impossible de supprimer une année scolaire active');
        }

        if ($annee->inscriptions_count > 0) {
            return back()->with('error', 'Impossible de supprimer une année scolaire avec des inscriptions');
        }

        DB::beginTransaction();
        try {
            // Supprimer les trimestres associés
            $annee->trimestres()->delete();
            $annee->delete();

            DB::commit();

            return redirect()->route('annees-scolaires.index')
                ->with('success', 'Année scolaire supprimée avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur suppression année scolaire', [
                'annee_id' => $id,
                'erreur' => $e->getMessage()
            ]);
            return back()->with('error', 'Erreur lors de la suppression: ' . $e->getMessage());
        }
    }

    // 🔹 Activation d'une année scolaire
    public function activer($id)
    {
        DB::beginTransaction();
        try {
            // Désactiver toutes les années
            AnneeScolaire::where('actif', true)->update(['actif' => false]);

            // Activer l'année sélectionnée
            $annee = AnneeScolaire::findOrFail($id);
            $annee->update(['actif' => true]);

            DB::commit();

            return back()->with('success', "L'année scolaire {$annee->nom} est maintenant active");
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur activation année scolaire', [
                'annee_id' => $id,
                'erreur' => $e->getMessage()
            ]);
            return back()->with('error', 'Erreur lors de l\'activation: ' . $e->getMessage());
        }
    }

    // 🔹 Méthode utilitaire : progression de l'année scolaire
    private function calculerProgression(AnneeScolaire $annee)
    {
        $now = Carbon::now();
        $start = Carbon::parse($annee->date_debut);
        $end = Carbon::parse($annee->date_fin);

        if ($now->lt($start)) return 0;
        if ($now->gt($end)) return 100;

        $total = $start->diffInDays($end);
        $ecoule = $start->diffInDays($now);

        return min(100, max(0, round(($ecoule / $total) * 100)));
    }

    // 🔹 Suggestions automatiques de nom d'année
    private function genererNomsSuggestions()
    {
        $currentYear = Carbon::now()->year;
        return [
            $currentYear . '-' . ($currentYear + 1),
            ($currentYear + 1) . '-' . ($currentYear + 2),
            ($currentYear + 2) . '-' . ($currentYear + 3),
        ];
    }
}
