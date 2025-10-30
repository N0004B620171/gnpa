<?php

namespace App\Http\Controllers;

use App\Models\HistoriqueTransfert;
use App\Models\TransfertAnnee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class HistoriqueTransfertController extends Controller
{
    /**
     * Liste des migrations effectuées.
     */
    public function index(Request $request)
    {
        $query = HistoriqueTransfert::with(['ancienneAnnee', 'nouvelleAnnee'])
            ->orderByDesc('created_at');

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('ancienneAnnee', fn($q) => $q->where('nom', 'like', "%{$search}%"))
                  ->orWhereHas('nouvelleAnnee', fn($q) => $q->where('nom', 'like', "%{$search}%"));
            });
        }

        if ($request->has('annulable')) {
            $query->where('annulable', $request->boolean('annulable'));
        }

        $perPage = $request->get('perPage', 10);
        $transferts = $query->paginate($perPage)->withQueryString();

        return Inertia::render('TransfertAnnee/HistoriqueTransfert', [
            'transferts' => $transferts,
            'filters' => [
                'search' => $request->search,
                'annulable' => $request->annulable,
                'perPage' => $perPage
            ],
        ]);
    }

    /**
     * Détails d'un historique de transfert.
     */
    public function show(HistoriqueTransfert $historiqueTransfert)
    {
        $historique = $historiqueTransfert->load(['ancienneAnnee', 'nouvelleAnnee']);

        $transferts = TransfertAnnee::with([
            'inscription.eleve',
            'inscription.classe.niveau',
            'ancienneAnnee',
            'nouvelleAnnee',
            'nouvelleClasse.niveau'
        ])->whereIn('id', json_decode($historique->transferts_ids, true))->get();

        $stats = [
            'total' => $transferts->count(),
            'passants' => $transferts->where('statut', 'passant')->count(),
            'redoublants' => $transferts->where('statut', 'redoublant')->count(),
            'sortants' => $transferts->where('statut', 'sortant')->count(),
        ];

        return Inertia::render('Annees/HistoriqueShow', [
            'historique' => $historique,
            'transferts' => $transferts,
            'stats' => $stats,
        ]);
    }

    /**
     * Annulation depuis la page d'historique.
     */
    public function annuler($id)
    {
        $historique = HistoriqueTransfert::findOrFail($id);

        if (!$historique->annulable) {
            return back()->with('error', 'Cette migration ne peut plus être annulée.');
        }

        DB::beginTransaction();
        try {
            $nouveaux = json_decode($historique->nouveaux_inscriptions_ids, true);
            $transferts = json_decode($historique->transferts_ids, true);

            DB::table('inscriptions')->whereIn('id', $nouveaux)->delete();
            DB::table('transferts_annees')->whereIn('id', $transferts)->delete();

            $historique->update(['annulable' => false]);

            DB::commit();
            return back()->with('success', 'Migration annulée avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Erreur lors de l\'annulation : ' . $e->getMessage());
        }
    }
}
