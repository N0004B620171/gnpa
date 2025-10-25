<?php

namespace App\Http\Controllers;

use App\Models\Bus;
use App\Models\Buse;
use App\Models\ItineraireTransport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BusController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['q', 'etat', 'perPage']);
        
        $q = Buse::query();

        if ($search = $filters['q'] ?? null) {
            $q->where(function($query) use ($search) {
                $query->where('immatriculation', 'like', "%{$search}%")
                      ->orWhere('chauffeur_nom', 'like', "%{$search}%")
                      ->orWhere('marque', 'like', "%{$search}%")
                      ->orWhere('modele', 'like', "%{$search}%");
            });
        }

        if ($etat = $filters['etat'] ?? null) {
            $q->where('etat', $etat);
        }

        $perPage = $filters['perPage'] ?? 15;

        return Inertia::render('Buses/Index', [
            'buses' => $q->latest()->paginate($perPage)->withQueryString(),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Buses/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'immatriculation' => 'required|string|max:50|unique:buses,immatriculation',
            'marque' => 'nullable|string|max:80',
            'modele' => 'nullable|string|max:80',
            'capacite' => 'required|integer|min:10|max:200',
            'chauffeur_nom' => 'required|string|max:120',
            'chauffeur_telephone' => 'nullable|string|max:40',
            'etat' => 'required|string|in:actif,maintenance,hors_service',
        ]);

        try {
            DB::transaction(function() use ($data) {
                Buse::create($data);
            });

            return redirect()->route('buses.index')
                ->with('success', 'Bus créé avec succès.');

        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Erreur lors de la création du bus: ' . $e->getMessage());
        }
    }

    public function edit(Buse $bus)
    {
        return Inertia::render('Buses/Edit', [
            'bus' => $bus
        ]);
    }

    public function update(Request $request, Buse $bus)
    {
        $data = $request->validate([
            'immatriculation' => 'required|string|max:50|unique:buses,immatriculation,'.$bus->id,
            'marque' => 'nullable|string|max:80',
            'modele' => 'nullable|string|max:80',
            'capacite' => 'required|integer|min:10|max:200',
            'chauffeur_nom' => 'required|string|max:120',
            'chauffeur_telephone' => 'nullable|string|max:40',
            'etat' => 'required|string|in:actif,maintenance,hors_service',
        ]);

        try {
            $bus->update($data);

            return back()->with('success', 'Bus mis à jour avec succès.');

        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Erreur lors de la mise à jour du bus: ' . $e->getMessage());
        }
    }

    public function destroy(Buse $bus)
    {
        // Vérifier si le bus est utilisé dans des itinéraires
        if (ItineraireTransport::where('bus_id', $bus->id)->exists()) {
            return back()->with('error', 'Impossible de supprimer ce bus car il est utilisé dans un ou plusieurs itinéraires.');
        }

        try {
            $bus->delete();

            return back()->with('success', 'Bus supprimé avec succès.');

        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la suppression du bus: ' . $e->getMessage());
        }
    }
}