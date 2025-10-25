<?php

namespace App\Http\Controllers;

use App\Models\Cycle;
use App\Models\Langue;
use App\Models\Service;
use App\Models\ServiceCiblage;
use App\Helpers\ServiceCiblageHelper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CycleController extends Controller
{
    public function index(Request $request)
    {
        $query = Cycle::withCount(['niveaux', 'langues']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'LIKE', "%{$search}%")
                  ->orWhere('systeme', 'LIKE', "%{$search}%");
            });
        }

        $perPage = $request->get('perPage', 10);
        $cycles = $query->orderBy('nom')->paginate($perPage)->withQueryString();

        return Inertia::render('Cycles/Index', [
            'cycles' => $cycles,
            'filters' => $request->only(['search', 'perPage']),
            'stats' => [
                'total' => Cycle::count(),
                'standard' => Cycle::where('systeme', 'standard')->count(),
                'bilingue' => Cycle::where('systeme', 'bilingue')->count(),
                'trilingue' => Cycle::where('systeme', 'trilingue')->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Cycles/Create', [
            'langues' => Langue::orderBy('nom')->get(['id', 'code', 'nom']),
            'systemes' => [
                ['value' => 'standard', 'label' => 'Standard (1 langue)', 'max_langues' => 1],
                ['value' => 'bilingue', 'label' => 'Bilingue (2 langues)', 'max_langues' => 2],
                ['value' => 'trilingue', 'label' => 'Trilingue (3 langues)', 'max_langues' => 3],
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:100|unique:cycles,nom',
            'systeme' => 'required|in:standard,bilingue,trilingue',
            'nombre_trimestres' => 'required|integer|min:1|max:3',
            'bareme' => 'required|numeric|min:1|max:100',
            'langues' => 'required|array|min:1',
            'langues.*' => 'exists:langues,id',
        ]);

        $nombreMax = match ($request->systeme) {
            'standard' => 1,
            'bilingue' => 2,
            'trilingue' => 3,
            default => 1,
        };

        if (count($request->langues) > $nombreMax) {
            return back()->withErrors([
                'langues' => "Le système {$request->systeme} n'autorise que {$nombreMax} langue(s)."
            ])->withInput();
        }

        DB::transaction(function () use ($request) {
            $cycle = Cycle::create([
                'nom' => $request->nom,
                'systeme' => $request->systeme,
                'nombre_trimestres' => $request->nombre_trimestres,
                'bareme' => $request->bareme,
            ]);

            $cycle->langues()->sync($request->langues);
        });

        return redirect()->route('cycles.index')->with('success', 'Cycle créé avec succès');
    }

    public function show(Cycle $cycle)
    {
        // Charger les services ciblages existants pour ce cycle
        $serviceCiblages = ServiceCiblage::with(['service'])
            ->where('ciblable_type', 'App\\Models\\Cycle')
            ->where('ciblable_id', $cycle->id)
            ->get();

        // Charger tous les services disponibles
        $services = Service::where('actif', true)->get();

        $cycle->load([
            'langues', 
            'niveaux.classes' => function($query) {
                $query->withCount('elevesActuels');
            },
            // 'niveaux.classes.affectationTransport.itineraireTransport.bus',
            // 'niveaux.classes.affectationTransport.itineraireTransport.service'
        ]);

        // Statistiques des bus
        $busStats = $this->getBusStats($cycle);

        return Inertia::render('Cycles/Show', [
            'cycle' => $cycle,
            'serviceCiblages' => $serviceCiblages,
            'services' => $services,
            'statistiques' => [
                'total_niveaux' => $cycle->niveaux->count(),
                'total_classes' => $cycle->niveaux->sum(function($niveau) {
                    return $niveau->classes->count();
                }),
                'total_eleves' => $cycle->niveaux->sum(function($niveau) {
                    return $niveau->classes->sum('eleves_actuels_count');
                }),
            ],
            'busStats' => $busStats
        ]);
    }

    /**
     * 🔗 Associer un service au cycle
     */
    public function associerService(Request $request, Cycle $cycle)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $resultat = ServiceCiblageHelper::associerService(
            $request->service_id,
            Cycle::class,
            $cycle->id
        );

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * ❌ Dissocier un service du cycle
     */
    public function dissocierService(ServiceCiblage $serviceCiblage)
    {
        $resultat = ServiceCiblageHelper::dissocierService($serviceCiblage);

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * 📊 Obtenir les statistiques des bus pour le cycle
     */
    private function getBusStats(Cycle $cycle)
    {
        $busUtilises = [];
        $totalElevesTransport = 0;

        foreach ($cycle->niveaux as $niveau) {
            foreach ($niveau->classes as $classe) {
                foreach ($classe->elevesActuels as $eleve) {
                    if ($eleve->affectationTransport && $eleve->affectationTransport->itineraireTransport->bus) {
                        $bus = $eleve->affectationTransport->itineraireTransport->bus;
                        $busId = $bus->id;
                        
                        if (!isset($busUtilises[$busId])) {
                            $busUtilises[$busId] = [
                                'bus' => $bus,
                                'count' => 0,
                                'itineraires' => []
                            ];
                        }
                        
                        $busUtilises[$busId]['count']++;
                        $itineraireId = $eleve->affectationTransport->itineraire_transport_id;
                        
                        if (!in_array($itineraireId, $busUtilises[$busId]['itineraires'])) {
                            $busUtilises[$busId]['itineraires'][] = $itineraireId;
                        }
                        
                        $totalElevesTransport++;
                    }
                }
            }
        }

        return [
            'busUtilises' => array_values($busUtilises),
            'totalBus' => count($busUtilises),
            'totalElevesTransport' => $totalElevesTransport,
            'totalItineraires' => array_sum(array_map(function($bus) {
                return count($bus['itineraires']);
            }, $busUtilises))
        ];
    }

    public function edit(Cycle $cycle)
    {
        $cycle->load('langues');

        return Inertia::render('Cycles/Edit', [
            'cycle' => $cycle,
            'langues' => Langue::orderBy('nom')->get(['id', 'code', 'nom']),
            'systemes' => [
                ['value' => 'standard', 'label' => 'Standard (1 langue)', 'max_langues' => 1],
                ['value' => 'bilingue', 'label' => 'Bilingue (2 langues)', 'max_langues' => 2],
                ['value' => 'trilingue', 'label' => 'Trilingue (3 langues)', 'max_langues' => 3],
            ]
        ]);
    }

    public function update(Request $request, Cycle $cycle)
    {
        $request->validate([
            'nom' => [
                'required',
                'string',
                'max:100',
                Rule::unique('cycles')->ignore($cycle->id)
            ],
            'systeme' => 'required|in:standard,bilingue,trilingue',
            'nombre_trimestres' => 'required|integer|min:1|max:3',
            'bareme' => 'required|numeric|min:1|max:100',
            'langues' => 'required|array|min:1',
            'langues.*' => 'exists:langues,id',
        ]);

        $nombreMax = match ($request->systeme) {
            'standard' => 1,
            'bilingue' => 2,
            'trilingue' => 3,
            default => 1,
        };

        if (count($request->langues) > $nombreMax) {
            return back()->withErrors([
                'langues' => "Le système {$request->systeme} n'autorise que {$nombreMax} langue(s)."
            ])->withInput();
        }

        DB::transaction(function () use ($cycle, $request) {
            $cycle->update([
                'nom' => $request->nom,
                'systeme' => $request->systeme,
                'nombre_trimestres' => $request->nombre_trimestres,
                'bareme' => $request->bareme,
            ]);

            $cycle->langues()->sync($request->langues);
        });

        return redirect()->route('cycles.index')->with('success', 'Cycle mis à jour avec succès');
    }

    public function destroy(Cycle $cycle)
    {
        if ($cycle->niveaux()->count() > 0) {
            return back()->with('error', 'Impossible de supprimer ce cycle car il contient des niveaux.');
        }

        DB::transaction(function () use ($cycle) {
            $cycle->langues()->detach();
            $cycle->delete();
        });

        return redirect()->route('cycles.index')->with('success', 'Cycle supprimé avec succès');
    }
}