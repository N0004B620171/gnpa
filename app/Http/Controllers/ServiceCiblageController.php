<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\ServiceCiblage;
use App\Models\Cycle;
use App\Models\Niveau;
use App\Models\Classe;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ServiceCiblageController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['service_id', 'type', 'perPage']);

        $query = ServiceCiblage::with(['service', 'ciblable']);

        if ($serviceId = $filters['service_id'] ?? null) {
            $query->where('service_id', $serviceId);
        }

        if ($type = $filters['type'] ?? null) {
            $query->where('ciblable_type', $type);
        }

        $perPage = $filters['perPage'] ?? 20;

        $service = null;
        if ($serviceId) {
            $service = Service::find($serviceId);
        }

        return Inertia::render('ServiceCiblages/Index', [
            'service' => $service,
            'ciblages' => $query->latest()->paginate($perPage)->withQueryString(),
            'filters' => $filters,
        ]);
    }

    public function create(Request $request)
    {
        $serviceId = $request->get('service_id');

        // Récupérer les services actifs
        $services = Service::where('actif', true)->get();

        // Récupérer les cycles avec formatage
        $cycles = Cycle::all()->map(function ($cycle) {
            return [
                'id' => $cycle->id,
                'nom' => $cycle->nom,
                'created_at' => $cycle->created_at,
                'updated_at' => $cycle->updated_at
            ];
        })->toArray();

        // Récupérer les niveaux avec leurs cycles
        $niveaux = Niveau::with('cycle')->get()->map(function ($niveau) {
            return [
                'id' => $niveau->id,
                'nom' => $niveau->nom,
                'cycle_id' => $niveau->cycle_id,
                'cycle' => $niveau->cycle ? [
                    'id' => $niveau->cycle->id,
                    'nom' => $niveau->cycle->nom
                ] : null,
                'created_at' => $niveau->created_at,
                'updated_at' => $niveau->updated_at
            ];
        })->toArray();

        // Récupérer les classes avec leurs niveaux et cycles
        $classes = Classe::with('niveau.cycle')->get()->map(function ($classe) {
            return [
                'id' => $classe->id,
                'nom' => $classe->nom,
                'niveau_id' => $classe->niveau_id,
                'niveau' => $classe->niveau ? [
                    'id' => $classe->niveau->id,
                    'nom' => $classe->niveau->nom,
                    'cycle' => $classe->niveau->cycle ? [
                        'id' => $classe->niveau->cycle->id,
                        'nom' => $classe->niveau->cycle->nom
                    ] : null
                ] : null,
                'created_at' => $classe->created_at,
                'updated_at' => $classe->updated_at
            ];
        })->toArray();

        // Récupérer les inscriptions actives avec élèves et classes
        $inscriptions = Inscription::with(['eleve', 'classe.niveau'])
            ->where('statut', 'actif')
            ->get()
            ->map(function ($inscription) {
                return [
                    'id' => $inscription->id,
                    'eleve_id' => $inscription->eleve_id,
                    'classe_id' => $inscription->classe_id,
                    'statut' => $inscription->statut,
                    'eleve' => $inscription->eleve ? [
                        'id' => $inscription->eleve->id,
                        'nom' => $inscription->eleve->nom,
                        'prenom' => $inscription->eleve->prenom,
                        'email' => $inscription->eleve->email
                    ] : null,
                    'classe' => $inscription->classe ? [
                        'id' => $inscription->classe->id,
                        'nom' => $inscription->classe->nom,
                        'niveau' => $inscription->classe->niveau ? [
                            'id' => $inscription->classe->niveau->id,
                            'nom' => $inscription->classe->niveau->nom
                        ] : null
                    ] : null,
                    'created_at' => $inscription->created_at,
                    'updated_at' => $inscription->updated_at
                ];
            })->toArray();
        return Inertia::render('ServiceCiblages/Create', [
            'services' => $services,
            'cycles' => $cycles,
            'niveaux' => $niveaux,
            'classes' => $classes,
            'inscriptions' => $inscriptions,
            'serviceId' => $serviceId,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'service_id' => 'required|exists:services,id',
            'ciblable_type' => 'required|string|in:App\\Models\\Cycle,App\\Models\\Niveau,App\\Models\\Classe,App\\Models\\Inscription',
            'ciblable_id' => [
                'required',
                'integer',
                function ($attribute, $value, $fail) use ($request) {
                    $type = $request->ciblable_type;
                    if (!class_exists($type)) {
                        $fail('Le type de cible est invalide.');
                        return;
                    }

                    if (!$type::where('id', $value)->exists()) {
                        $fail('La cible sélectionnée n\'existe pas.');
                    }
                },
            ],
        ]);

        // Vérifier si le ciblage existe déjà
        $existingCiblage = ServiceCiblage::where([
            'service_id' => $data['service_id'],
            'ciblable_type' => $data['ciblable_type'],
            'ciblable_id' => $data['ciblable_id'],
        ])->exists();

        if ($existingCiblage) {
            return back()->withErrors(['ciblable_id' => 'Ce ciblage existe déjà.'])->withInput();
        }

        DB::transaction(function () use ($data) {
            ServiceCiblage::create($data);
        });

        $redirectUrl = $data['service_id']
            ? "/service-ciblages?service_id={$data['service_id']}"
            : "/service-ciblages";

        return redirect($redirectUrl)->with('success', 'Ciblage créé avec succès.');
    }

    public function destroy(ServiceCiblage $serviceCiblage)
    {
        $serviceId = $serviceCiblage->service_id;
        $serviceCiblage->delete();

        $redirectUrl = $serviceId
            ? "/service-ciblages?service_id={$serviceId}"
            : "/service-ciblages";

        return redirect($redirectUrl)->with('success', 'Ciblage supprimé avec succès.');
    }
}
