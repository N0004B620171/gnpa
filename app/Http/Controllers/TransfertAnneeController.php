<?php

namespace App\Http\Controllers;

use App\Helpers\AnneeScolaireHelper;
use App\Models\AnneeScolaire;
use App\Models\Classe;
use App\Models\HistoriqueTransfert;
use App\Models\Inscription;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransfertAnneeController extends Controller
{
    public function index()
    {
        $anneeActive = AnneeScolaire::where('actif', true)->first();
        $anneesScolaires = AnneeScolaire::orderByDesc('date_debut')->get();

        $classes = Classe::with([
            'niveau.cycle', 
            'professeur', 
            'inscriptions' => function ($query) use ($anneeActive) {
                if ($anneeActive) {
                    $query->where('annee_scolaire_id', $anneeActive->id)
                          ->where('statut', 'actif');
                }
            }
        ])->orderBy('niveau_id')->get();

        $stats = null;
        if ($anneeActive) {
            $stats = [
                'total_eleves' => Inscription::where('annee_scolaire_id', $anneeActive->id)->count(),
                'total_classes' => $classes->count(),
                'classes_avec_eleves' => $classes->filter(fn ($classe) => $classe->inscriptions->count() > 0)->count(),
            ];
        }

        return Inertia::render('TransfertAnnee/Transfert', [
            'anneeActive' => $anneeActive,
            'annees' => $anneesScolaires,
            'classes' => $classes,
            'niveaux' => Niveau::with('cycle')->orderBy('cycle_id')->get(),
            'dernierTransfert' => HistoriqueTransfert::with(['ancienneAnnee', 'nouvelleAnnee'])
                ->latest()
                ->first(),
            'statsAnneeActive' => $stats,
        ]);
    }

    public function transferer(Request $request)
    {
        $validated = $request->validate([
            'ancienne_annee_id' => 'required|exists:annee_scolaires,id',
            'nouvelle_annee_id' => 'required|exists:annee_scolaires,id|different:ancienne_annee_id',
            'mapping_classes' => 'required|array',
            'mapping_classes.*' => 'required|exists:classes,id',
        ]);

        // Vérifier que la nouvelle année n'a pas d'inscriptions
        $inscriptionsNouvelleAnnee = Inscription::where('annee_scolaire_id', $validated['nouvelle_annee_id'])->count();
        if ($inscriptionsNouvelleAnnee > 0) {
            return back()->with('error', 'La nouvelle année scolaire a déjà des inscriptions. Veuillez choisir une année vide.');
        }

        DB::beginTransaction();
        try {
            $result = AnneeScolaireHelper::transfererVersNouvelleAnnee(
                $validated['ancienne_annee_id'],
                $validated['nouvelle_annee_id'],
                $validated['mapping_classes']
            );

            DB::commit();

            return redirect()->route('transfert.index')->with([
                'success' => 'Transfert effectué avec succès. ' . 
                            $result['passants'] . ' passant(s), ' .
                            $result['redoublants'] . ' redoublant(s), ' .
                            $result['sortants'] . ' sortant(s).',
                'stats' => $result,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur transfert année: ' . $e->getMessage(), [
                'ancienne_annee' => $validated['ancienne_annee_id'],
                'nouvelle_annee' => $validated['nouvelle_annee_id'],
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Erreur lors du transfert : ' . $e->getMessage());
        }
    }

    public function annuler($id)
    {
        $historique = HistoriqueTransfert::find($id);

        if (!$historique) {
            return back()->with('error', 'Historique de transfert non trouvé.');
        }

        if (!$historique->annulable) {
            return back()->with('error', 'Cette migration ne peut plus être annulée.');
        }

        DB::beginTransaction();
        try {
            $nouveaux = json_decode($historique->nouveaux_inscriptions_ids, true);
            $transferts = json_decode($historique->transferts_ids, true);

            // Supprimer les nouvelles inscriptions
            Inscription::whereIn('id', $nouveaux)->delete();
            
            // Supprimer les enregistrements de transfert
            \App\Models\TransfertAnnee::whereIn('id', $transferts)->delete();

            $historique->update(['annulable' => false]);

            DB::commit();
            
            return back()->with('success', 'Migration annulée avec succès. ' . count($nouveaux) . ' inscription(s) supprimée(s).');
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur annulation transfert: ' . $e->getMessage(), [
                'historique_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->with('error', 'Erreur lors de l\'annulation : ' . $e->getMessage());
        }
    }
}