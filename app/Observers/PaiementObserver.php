<?php

namespace App\Observers;

use App\Models\Paiement;
use App\Helpers\PaiementHelper;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaiementObserver
{
    /**
     * 🟢 Lorsqu’un paiement est créé
     */
    public function created(Paiement $paiement)
    {
        $this->majFacture($paiement, '🟢 Nouveau paiement enregistré');
    }

    /**
     * 🟡 Lorsqu’un paiement est mis à jour
     */
    public function updated(Paiement $paiement)
    {
        $this->majFacture($paiement, '🟡 Paiement mis à jour');
    }

    /**
     * 🔴 Lorsqu’un paiement est supprimé
     */
    public function deleted(Paiement $paiement)
    {
        try {
            DB::beginTransaction();

            $detail = $paiement->factureDetail;
            $facture = $paiement->facture;

            if ($detail) {
                // recalcul des paiements liés à ce service
                $totalDetail = $detail->paiements()->sum('montant');
                $statut = 'non_paye';
                if ($totalDetail >= $detail->montant) {
                    $statut = 'paye';
                } elseif ($totalDetail > 0) {
                    $statut = 'partiel';
                }

                $detail->update([
                    'montant_paye' => $totalDetail,
                    'statut' => $statut,
                ]);
            }

            // ⚙️ Recalcule la facture globale
            PaiementHelper::recalculerMontantsFacture($facture);

            DB::commit();
            Log::info("🔴 Paiement supprimé — facture #{$facture->id} mise à jour");
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("❌ [PaiementObserver] Erreur suppression paiement : " . $e->getMessage());
        }
    }

    /**
     * ⚙️ Mise à jour automatique de la facture concernée
     */
    protected function majFacture(Paiement $paiement, string $action)
    {
        try {
            DB::beginTransaction();

            $facture = $paiement->facture()->with('details')->first();
            if (!$facture) {
                Log::warning("⚠️ Facture introuvable pour paiement #{$paiement->id}");
                return;
            }

            Log::info("{$action} — mise à jour de la facture #{$facture->id}");

            // Mise à jour du détail du service si applicable
            if ($paiement->facture_detail_id) {
                $detail = $facture->details()->find($paiement->facture_detail_id);
                if ($detail) {
                    $total = $detail->paiements()->sum('montant');
                    $statut = 'non_paye';
                    if ($total >= $detail->montant) {
                        $statut = 'paye';
                    } elseif ($total > 0) {
                        $statut = 'partiel';
                    }

                    $detail->update([
                        'montant_paye' => $total,
                        'statut' => $statut,
                    ]);
                }
            }

            // 🔁 Recalcule le total facture
            PaiementHelper::recalculerMontantsFacture($facture);

            DB::commit();
            Log::info("✅ Facture #{$facture->id} mise à jour suite à {$action}");

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("❌ [PaiementObserver] Erreur mise à jour facture : " . $e->getMessage());
        }
    }
}
