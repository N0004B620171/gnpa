<?php

namespace App\Helpers;

use App\Models\Paiement;
use App\Models\Facture;
use App\Models\FactureDetail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaiementHelper
{
    /**
     * 💰 Enregistre un paiement pour un service donné (FactureDetail)
     * et met à jour la facture globale.
     */
    public static function enregistrerPaiementService(FactureDetail $detail, float $montant, string $mode, ?string $reference = null)
    {
        try {
            DB::beginTransaction();

            $facture = $detail->facture()->lockForUpdate()->first();

            // Validation métier
            if ($montant <= 0) {
                throw new \Exception("Le montant du paiement doit être supérieur à 0.");
            }
            $resteDetail = max(0, $detail->montant - $detail->montant_paye);
            if ($montant > $resteDetail) {
                throw new \Exception("Le montant dépasse le total dû pour le service [{$detail->service_nom}].");
            }

            // Création du paiement (référence et numéro de reçu auto via modèle)
            $paiement = Paiement::create([
                'facture_id'         => $facture->id,
                'facture_detail_id'  => $detail->id,
                'montant'            => $montant,
                'mode_paiement'      => $mode,
                'reference_transaction' => $reference, // peut rester null
                'date_paiement'      => now(),
            ]);

            Log::info("💰 Paiement de {$montant} F enregistré pour le service [{$detail->service_nom}] facture #{$facture->id}");

            // Mise à jour du détail
            $nouveauMontantPaye = $detail->montant_paye + $montant;
            $statut = 'non_paye';
            if ($nouveauMontantPaye >= $detail->montant) {
                $statut = 'paye';
            } elseif ($nouveauMontantPaye > 0) {
                $statut = 'partiel';
            }

            $detail->update([
                'montant_paye' => $nouveauMontantPaye,
                'statut'       => $statut,
            ]);

            // Recalcul de la facture globale
            self::recalculerMontantsFacture($facture->fresh(['details']));

            DB::commit();
            return $paiement;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("❌ [PaiementHelper] Erreur paiement service : " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * 💳 Enregistre un paiement GLOBAL affecté automatiquement sur les services impayés
     * Ordre: services non payés → partiels, en respectant les montants restants.
     */
    public static function enregistrerPaiementGlobal(Facture $facture, float $montant, string $mode, ?string $reference = null): array
    {
        if ($montant <= 0) {
            throw new \Exception("Le montant du paiement doit être supérieur à 0.");
        }

        try {
            DB::beginTransaction();

            // Verrou factures & détails
            $facture = Facture::with(['details' => function($q) {
                $q->orderByRaw("FIELD(statut, 'non_paye','partiel','paye') ASC")
                  ->orderBy('id', 'asc');
            }])->lockForUpdate()->findOrFail($facture->id);

            $resteFacture = max(0, $facture->montant_total - $facture->montant_paye);
            if ($montant > $resteFacture) {
                throw new \Exception("Le montant dépasse le reste à payer de la facture ({$resteFacture}).");
            }

            $reste = $montant;
            $paiements = [];

            foreach ($facture->details as $detail) {
                if ($reste <= 0) break;
                if ($detail->statut === 'paye') continue;

                $resteDetail = max(0, $detail->montant - $detail->montant_paye);
                if ($resteDetail <= 0) continue;

                $part = min($resteDetail, $reste);

                // Crée un paiement “fragment” sur ce detail
                $paiement = Paiement::create([
                    'facture_id'        => $facture->id,
                    'facture_detail_id' => $detail->id,
                    'montant'           => $part,
                    'mode_paiement'     => $mode,
                    'reference_transaction' => $reference, // peut rester null
                    'date_paiement'     => now(),
                ]);
                $paiements[] = $paiement;

                // Met à jour le détail
                $detail->montant_paye += $part;
                if ($detail->montant_paye >= $detail->montant) {
                    $detail->statut = 'paye';
                } elseif ($detail->montant_paye > 0) {
                    $detail->statut = 'partiel';
                }
                $detail->save();

                $reste -= $part;
            }

            // Recalcul de la facture
            self::recalculerMontantsFacture($facture->fresh(['details']));

            DB::commit();
            return $paiements;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("❌ [PaiementHelper] Erreur paiement global : " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * 🔁 Recalcule les montants et le statut d’une facture
     */
    public static function recalculerMontantsFacture(Facture $facture)
    {
        $total   = $facture->details()->sum('montant');
        $paye    = $facture->details()->sum('montant_paye');
        $restant = max(0, $total - $paye);

        $statut = 'non_paye';
        if ($paye >= $total && $total > 0) {
            $statut = 'paye';
        } elseif ($paye > 0 && $paye < $total) {
            $statut = 'partiel';
        }

        $facture->update([
            'montant_total'   => $total,
            'montant_paye'    => $paye,
            'statut'          => $statut,
        ]);

        Log::info("📊 Facture #{$facture->id} mise à jour → total={$total}, payé={$paye}, restant={$restant}, statut={$statut}");
    }
}
