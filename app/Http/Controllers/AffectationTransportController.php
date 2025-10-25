<?php

namespace App\Http\Controllers;

use App\Models\AffectationTransport;
use App\Models\ItineraireTransport;
use App\Models\Inscription;
use App\Models\Arret;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Helpers\FactureHelper;
use Inertia\Inertia;

class AffectationTransportController extends Controller
{
    public function index(Request $request)
    {
        $q = AffectationTransport::with([
            'inscription.eleve', 
            'inscription.classe',
            'inscription.anneeScolaire',
            'itineraireTransport.service', 
            'itineraireTransport.bus',
            'arret'
        ]);

        if ($request->filled('q')) {
            $term = $request->q;
            $q->whereHas('inscription.eleve', function($e) use ($term) {
                $e->where('nom','like',"%{$term}%")
                  ->orWhere('prenom','like',"%{$term}%");
            })->orWhereHas('itineraireTransport', function($i) use ($term) {
                $i->where('nom','like',"%{$term}%");
            });
        }

        return Inertia::render('AffectationTransports/Index', [
            'affectations' => $q->latest()->paginate(20)->withQueryString(),
            'filters' => $request->only('q'),
            'inscriptions' => Inscription::with(['eleve', 'classe.niveau', 'anneeScolaire'])
                ->where('statut', 'actif')
                ->get(),
            'itineraires' => ItineraireTransport::with(['bus', 'service', 'arrets'])->get(),
        ]);
    }

    public function getArrets(ItineraireTransport $itineraire)
    {
        return response()->json([
            'arrets' => $itineraire->arrets()->orderBy('ordre')->get()
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'inscription_id' => 'required|exists:inscriptions,id',
            'itineraire_transport_id' => 'required|exists:itineraire_transports,id',
            'arret_id' => 'nullable|exists:arrets,id',
            'actif' => 'boolean'
        ]);

        // Vérifier si l'affectation existe déjà
        $existingAffectation = AffectationTransport::where([
            'inscription_id' => $data['inscription_id'],
            'itineraire_transport_id' => $data['itineraire_transport_id']
        ])->exists();

        if ($existingAffectation) {
            return back()->with('error', 'Cet élève est déjà affecté à cet itinéraire.');
        }

        $affectation = DB::transaction(function() use ($data) {
            $aff = AffectationTransport::create($data);

            // Générer/mettre à jour la facture du mois en cours si l'itinéraire a un service
            $itineraire = ItineraireTransport::with('service')->find($data['itineraire_transport_id']);
            if ($itineraire && $itineraire->service) {
                $inscription = Inscription::with('anneeScolaire')->find($data['inscription_id']);
                $mois = (int) now()->format('n');
                $annee = (int) now()->format('Y');
                FactureHelper::creerFactureMensuelle($inscription, $mois, $annee);
            }

            return $aff;
        });

        return back()->with('success', 'Élève affecté au transport avec succès.');
    }

    public function update(Request $request, AffectationTransport $affectation)
    {
        $data = $request->validate([
            'arret_id' => 'nullable|exists:arrets,id',
            'actif' => 'boolean'
        ]);

        $affectation->update($data);
        return back()->with('success', 'Affectation mise à jour avec succès.');
    }

    public function destroy(AffectationTransport $affectation)
    {
        $affectation->delete();
        return back()->with('success', 'Affectation supprimée avec succès.');
    }
}