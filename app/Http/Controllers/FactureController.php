<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Helpers\FactureHelper;

class FactureController extends Controller
{
    public function index(Request $request)
    {
        $q = Facture::with('inscription.eleve', 'inscription.classe');

        if ($request->filled('q')) {
            $term = $request->q;
            $q->whereHas('inscription.eleve', function($e) use ($term) {
                $e->where('nom', 'like', "%{$term}%")
                  ->orWhere('prenom', 'like', "%{$term}%");
            });
        }
        if ($request->filled('mois')) $q->where('mois', $request->mois);
        if ($request->filled('annee')) $q->where('annee', $request->annee);
        if ($request->filled('statut')) $q->where('statut', $request->statut);

        return Inertia::render('Factures/Index', [
            'factures' => $q->latest()->paginate(20)->withQueryString(),
            'filters' => $request->only('q','mois','annee','statut')
        ]);
    }

    public function show(Facture $facture)
    {
        $facture->load('inscription.eleve', 'inscription.classe.niveau', 'details', 'paiements');

        return Inertia::render('Factures/Show', [
            'facture' => $facture
        ]);
    }

    // Génère (ou met à jour) la facture mensuelle d’une inscription
    public function generateMensuelle(Request $request, Inscription $inscription)
    {
        $data = $request->validate([
            'mois' => 'required|integer|min:1|max:12',
            'annee' => 'required|integer|min:2000|max:2100',
        ]);

        DB::transaction(function() use ($inscription, $data) {
            FactureHelper::creerFactureMensuelle($inscription, $data['mois'], $data['annee']);
        });

        return back()->with('success', 'Facture mensuelle générée / mise à jour.');
    }

    // Regénérer toutes les factures de l’année scolaire pour l’inscription
    public function regenerateAnnee(Inscription $inscription)
    {
        DB::transaction(function() use ($inscription) {
            FactureHelper::genererFacturesAnnuelles($inscription);
        });

        return back()->with('success', 'Factures annuelles régénérées.');
    }
}
