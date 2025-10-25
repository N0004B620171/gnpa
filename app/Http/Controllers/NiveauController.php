<?php

namespace App\Http\Controllers;

use App\Models\Niveau;
use App\Models\Cycle;
use App\Models\ServiceCiblage;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Helpers\ServiceCiblageHelper;

class NiveauController extends Controller
{
    public function index(Request $request)
    {
        $query = Niveau::with(['cycle', 'classes', 'matieres']);

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nom', 'LIKE', "%{$search}%")
                  ->orWhereHas('cycle', function($q) use ($search) {
                      $q->where('nom', 'LIKE', "%{$search}%");
                  });
        }

        if ($request->has('cycle_id') && $request->cycle_id != '') {
            $query->where('cycle_id', $request->cycle_id);
        }

        $perPage = $request->get('perPage', 10);
        $niveaux = $query->paginate($perPage);

        return Inertia::render('Niveaux/Index', [
            'niveaux' => $niveaux,
            'cycles' => Cycle::all(),
            'filters' => [
                'search' => $request->search,
                'cycle_id' => $request->cycle_id,
                'perPage' => $perPage
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Niveaux/Create', [
            'cycles' => Cycle::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'cycle_id' => 'required|exists:cycles,id',
            'moyenne_min_pour_passage' => 'required|numeric|min:0|max:20'
        ]);

        Niveau::create($request->all());

        return redirect()->route('niveaux.index')
            ->with('success', 'Niveau créé avec succès');
    }

    public function show(Niveau $niveau)
    {
        $niveau->load([
            'cycle',
            'classes.professeur',
            'matieres',
            'classes.inscriptions.eleve'
        ]);

        // Récupérer les services appliqués à ce niveau
        $serviceCiblages = ServiceCiblage::with(['service'])
            ->where('ciblable_type', 'App\\Models\\Niveau')
            ->where('ciblable_id', $niveau->id)
            ->get();

        // Récupérer tous les services disponibles
        $services = Service::where('actif', true)->get();

        return Inertia::render('Niveaux/Show', [
            'niveau' => $niveau,
            'serviceCiblages' => $serviceCiblages,
            'services' => $services
        ]);
    }

    /**
     * 🔗 Associer un service au niveau
     */
    public function associerService(Request $request, Niveau $niveau)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);

        $resultat = ServiceCiblageHelper::associerService(
            $request->service_id,
            Niveau::class,
            $niveau->id
        );

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    /**
     * ❌ Dissocier un service du niveau
     */
    public function dissocierService(ServiceCiblage $serviceCiblage)
    {
        $resultat = ServiceCiblageHelper::dissocierService($serviceCiblage);

        $status = $resultat['success'] ? 'success' : 'error';
        return back()->with($status, $resultat['message']);
    }

    public function edit(Niveau $niveau)
    {
        return Inertia::render('Niveaux/Edit', [
            'niveau' => $niveau,
            'cycles' => Cycle::all()
        ]);
    }

    public function update(Request $request, Niveau $niveau)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'cycle_id' => 'required|exists:cycles,id',
            'moyenne_min_pour_passage' => 'required|numeric|min:0|max:20'
        ]);

        $niveau->update($request->all());

        return redirect()->route('niveaux.index')
            ->with('success', 'Niveau mis à jour avec succès');
    }

    public function destroy(Niveau $niveau)
    {
        if ($niveau->classes()->count() > 0 || $niveau->matieres()->count() > 0) {
            return redirect()->back()
                ->with('error', 'Impossible de supprimer ce niveau car il est utilisé');
        }

        $niveau->delete();

        return redirect()->route('niveaux.index')
            ->with('success', 'Niveau supprimé avec succès');
    }
}