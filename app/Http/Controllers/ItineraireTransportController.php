<?php

namespace App\Http\Controllers;

use App\Models\ItineraireTransport;
use App\Models\Service;
use App\Models\Arret;
use App\Models\AffectationTransport;
use App\Models\Buse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ItineraireTransportController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['q', 'perPage']);
        
        $q = ItineraireTransport::with(['bus', 'service', 'arrets']);

        if ($search = $filters['q'] ?? null) {
            $q->where(function($query) use ($search) {
                $query->where('nom', 'like', "%{$search}%")
                      ->orWhereHas('bus', function($busQuery) use ($search) {
                          $busQuery->where('immatriculation', 'like', "%{$search}%");
                      })
                      ->orWhereHas('service', function($serviceQuery) use ($search) {
                          $serviceQuery->where('nom', 'like', "%{$search}%")
                                      ->orWhere('code', 'like', "%{$search}%");
                      });
            });
        }

        $perPage = $filters['perPage'] ?? 15;

        return Inertia::render('TransportsItineraires/Index', [
            'itineraires' => $q->latest()->paginate($perPage)->withQueryString(),
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $buses = Buse::where('etat', 'actif')
            ->select('id', 'immatriculation', 'marque', 'modele', 'capacite')
            ->get();

        $services = Service::where('actif', true)
            ->select('id', 'nom', 'code', 'montant', 'description')
            ->get();

        return Inertia::render('TransportsItineraires/Create', [
            'buses' => $buses,
            'services' => $services,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:150|unique:itineraire_transports,nom',
            'bus_id' => 'nullable|exists:buses,id',
            'service_id' => 'nullable|exists:services,id',
        ]);

        try {
            DB::transaction(function() use ($data) {
                ItineraireTransport::create($data);
            });

            return redirect()->route('itineraires-transports.index')
                ->with('success', 'Itinéraire créé avec succès.');

        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Erreur lors de la création de l\'itinéraire: ' . $e->getMessage());
        }
    }

    public function edit(ItineraireTransport $itineraire)
    {
        $buses = Buse::where('etat', 'actif')
            ->select('id', 'immatriculation', 'marque', 'modele', 'capacite')
            ->get();

        $services = Service::where('actif', true)
            ->select('id', 'nom', 'code', 'montant', 'description')
            ->get();

        return Inertia::render('Transports/Itineraires/Edit', [
            'itineraire' => $itineraire->load(['bus', 'service', 'arrets']),
            'buses' => $buses,
            'services' => $services,
        ]);
    }

    public function update(Request $request, ItineraireTransport $itineraire)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:150|unique:itineraire_transports,nom,' . $itineraire->id,
            'bus_id' => 'nullable|exists:buses,id',
            'service_id' => 'nullable|exists:services,id',
        ]);

        try {
            $itineraire->update($data);

            return back()->with('success', 'Itinéraire mis à jour avec succès.');

        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Erreur lors de la mise à jour de l\'itinéraire: ' . $e->getMessage());
        }
    }

    public function destroy(ItineraireTransport $itineraire)
    {
        // Vérifier si l'itinéraire est utilisé dans des affectations
        if (AffectationTransport::where('itineraire_transport_id', $itineraire->id)->exists()) {
            return back()->with('error', 'Impossible de supprimer cet itinéraire car il est utilisé dans des affectations de transport.');
        }

        // Vérifier si l'itinéraire a des arrêts
        if ($itineraire->arrets()->exists()) {
            return back()->with('error', 'Impossible de supprimer cet itinéraire car il contient des arrêts. Veuillez d\'abord supprimer les arrêts.');
        }

        try {
            $itineraire->delete();

            return back()->with('success', 'Itinéraire supprimé avec succès.');

        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la suppression de l\'itinéraire: ' . $e->getMessage());
        }
    }
}