<?php

namespace App\Http\Controllers;

use App\Models\Eleve;
use App\Models\Facture;
use App\Models\FactureDetail;
use App\Models\Inscription;
use Illuminate\Http\Request;
use App\Helpers\PaiementHelper;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaiementController extends Controller
{
    /**
     * 🧍‍♂️ Étape 1 : page de recherche d’élève avant paiement
     */
    public function index(Request $request)
    {
        $search = $request->get('search');

        $inscriptions = Inscription::with(['eleve', 'classe.niveau.cycle', 'anneeScolaire'])
            ->whereHas('anneeScolaire', fn($q) => $q->where('actif', true))
            ->where('statut', 'actif')
            ->when($search, function ($q) use ($search) {
                $q->whereHas('eleve', function ($qe) use ($search) {
                    $qe->where('prenom', 'like', "%{$search}%")
                       ->orWhere('nom', 'like', "%{$search}%");
                });
            })
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return Inertia::render('Paiements/Index', [
            'inscriptions' => $inscriptions,
            'search' => $search,
        ]);
    }

    /**
     * 🧾 Étape 2 : Affiche la liste des factures pour un élève sélectionné
     */
    public function showEleve(Inscription $inscription)
    {
        $inscription->load(['eleve', 'classe.niveau.cycle', 'anneeScolaire']);

        $factures = Facture::with('details')
            ->where('inscription_id', $inscription->id)
            ->orderByDesc('annee')
            ->orderByDesc('mois')
            ->get();

        return Inertia::render('Paiements/Factures', [
            'inscription' => $inscription,
            'factures' => $factures,
        ]);
    }

    /**
     * 🧾 Étape 3 : Formulaire de paiement pour une facture donnée
     */
    public function create(Facture $facture)
    {
        $facture->load([
            'details',
            'inscription.eleve',
            'inscription.classe.niveau.cycle',
            'inscription.anneeScolaire',
        ]);

        return Inertia::render('Paiements/Create', [
            'facture' => $facture
        ]);
    }

    /**
     * 💰 Étape 4 : Enregistre un paiement global ou par service
     */
    public function store(Request $request, Facture $facture)
    {
        $data = $request->validate([
            'montant'           => 'required|numeric|min:0.01',
            'mode'              => 'required|string|in:espèces,cheque,virement,mobile_money',
            'facture_detail_id' => 'nullable|exists:facture_details,id',
        ]);

        $validator = validator($data, [
            'montant' => [
                function ($attribute, $value, $fail) use ($facture, $data) {
                    $facture->load('details');
                    $totalRestant = max(0, $facture->details->sum('montant') - $facture->details->sum('montant_paye'));

                    if (!empty($data['facture_detail_id'])) {
                        $detail = FactureDetail::find($data['facture_detail_id']);
                        if (!$detail || $detail->facture_id !== $facture->id) {
                            $fail("Le service sélectionné ne correspond pas à cette facture.");
                            return;
                        }

                        $reste = max(0, $detail->montant - $detail->montant_paye);
                        if ($value > $reste) {
                            $fail("Le montant dépasse le reste à payer pour ce service ({$reste} FCFA).");
                        }
                    } elseif ($value > $totalRestant) {
                        $fail("Le montant dépasse le total restant de la facture ({$totalRestant} FCFA).");
                    }
                }
            ],
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        try {
            DB::transaction(function () use ($facture, $data) {
                if (!empty($data['facture_detail_id'])) {
                    // Paiement ciblé
                    $detail = FactureDetail::findOrFail($data['facture_detail_id']);
                    PaiementHelper::enregistrerPaiementService(
                        $detail,
                        (float) $data['montant'],
                        $data['mode']
                    );
                } else {
                    // Paiement global
                    PaiementHelper::enregistrerPaiementGlobal(
                        $facture,
                        (float) $data['montant'],
                        $data['mode']
                    );
                }
            });

            return redirect()
                ->route('paiements.create', $facture)
                ->with('success', '✅ Paiement enregistré avec succès.');

        } catch (\Throwable $e) {
            Log::error("❌ [PaiementController] Erreur store : " . $e->getMessage());
            return back()
                ->withInput()
                ->with('error', 'Erreur lors de l’enregistrement du paiement : ' . $e->getMessage());
        }
    }
}
