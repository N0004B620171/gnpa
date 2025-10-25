<?php

namespace App\Http\Controllers;

use App\Models\Arret;
use App\Models\ItineraireTransport;
use App\Models\AffectationTransport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ArretController extends Controller
{
    public function index(ItineraireTransport $itineraire)
    {
        $itineraire->load(['arrets' => function($query) {
            $query->orderBy('ordre')->orderBy('nom');
        }, 'bus', 'service']);

        return Inertia::render('Arrets/Index', [
            'itineraire' => $itineraire
        ]);
    }

    public function store(Request $request, ItineraireTransport $itineraire)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:150',
            'ordre' => 'nullable|numeric|min:0',
        ]);

        // Vérifier si l'ordre est déjà utilisé
        if (!empty($data['ordre'])) {
            $existingArret = Arret::where('itineraire_transport_id', $itineraire->id)
                ->where('ordre', $data['ordre'])
                ->first();

            if ($existingArret) {
                return back()->with('error', 'Cet ordre est déjà utilisé par un autre arrêt.');
            }
        }

        try {
            DB::transaction(function() use ($itineraire, $data) {
                $data['itineraire_transport_id'] = $itineraire->id;
                Arret::create($data);
            });

            return back()->with('success', 'Arrêt ajouté avec succès.');

        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Erreur lors de l\'ajout de l\'arrêt: ' . $e->getMessage());
        }
    }

    public function update(Request $request, ItineraireTransport $itineraire, Arret $arret)
    {
        // Vérifier que l'arrêt appartient bien à l'itinéraire
        abort_if($arret->itineraire_transport_id !== $itineraire->id, 404);

        $data = $request->validate([
            'nom' => 'required|string|max:150',
            'ordre' => 'nullable|numeric|min:0',
        ]);

        // Vérifier si l'ordre est déjà utilisé (sauf par cet arrêt)
        if (!empty($data['ordre'])) {
            $existingArret = Arret::where('itineraire_transport_id', $itineraire->id)
                ->where('ordre', $data['ordre'])
                ->where('id', '!=', $arret->id)
                ->first();

            if ($existingArret) {
                return back()->with('error', 'Cet ordre est déjà utilisé par un autre arrêt.');
            }
        }

        try {
            $arret->update($data);

            return back()->with('success', 'Arrêt mis à jour avec succès.');

        } catch (\Exception $e) {
            return back()->withInput()
                ->with('error', 'Erreur lors de la mise à jour de l\'arrêt: ' . $e->getMessage());
        }
    }

    public function destroy(ItineraireTransport $itineraire, Arret $arret)
    {
        // Vérifier que l'arrêt appartient bien à l'itinéraire
        abort_if($arret->itineraire_transport_id !== $itineraire->id, 404);

        // Vérifier si l'arrêt est utilisé dans des affectations
        if (AffectationTransport::where('arret_id', $arret->id)->exists()) {
            return back()->with('error', 'Impossible de supprimer cet arrêt car il est utilisé dans des affectations de transport.');
        }

        try {
            $arret->delete();

            return back()->with('success', 'Arrêt supprimé avec succès.');

        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la suppression de l\'arrêt: ' . $e->getMessage());
        }
    }

    public function reorder(Request $request, ItineraireTransport $itineraire)
    {
        $data = $request->validate([
            'arrets' => 'required|array',
            'arrets.*.id' => 'required|exists:arrets,id',
            'arrets.*.ordre' => 'required|numeric|min:0',
        ]);

        try {
            DB::transaction(function() use ($itineraire, $data) {
                foreach ($data['arrets'] as $arretData) {
                    $arret = Arret::find($arretData['id']);
                    
                    // Vérifier que l'arrêt appartient à l'itinéraire
                    if ($arret->itineraire_transport_id === $itineraire->id) {
                        $arret->update(['ordre' => $arretData['ordre']]);
                    }
                }
            });

            return back()->with('success', 'Ordre des arrêts mis à jour avec succès.');

        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la réorganisation des arrêts: ' . $e->getMessage());
        }
    }
}