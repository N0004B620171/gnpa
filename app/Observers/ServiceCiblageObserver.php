<?php

namespace App\Observers;

use App\Models\ServiceCiblage;
use App\Models\Inscription;
use App\Helpers\FactureHelper;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ServiceCiblageObserver
{
    /**
     * 🟢 Lorsqu’un nouveau service est associé (créé)
     */
    public function created(ServiceCiblage $ciblage)
    {
        try {
            DB::beginTransaction();

            $service = $ciblage->service;
            if (!$service || !$service->actif) {
                Log::info("⚠️ Service inactif ignoré pour ciblage #{$ciblage->id}");
                DB::commit();
                return;
            }

            Log::info("🧩 Nouveau service associé : {$service->nom}");

            // 🔍 Identifier les inscriptions concernées
            $inscriptions = $this->getInscriptionsCiblees($ciblage);
            $mois = Carbon::now()->month;
            $annee = Carbon::now()->year;

            foreach ($inscriptions as $inscription) {
                $facture = FactureHelper::creerFactureMensuelle($inscription, $mois, $annee);

                // Vérifie que le service n’est pas déjà dans la facture
                $existe = $facture->details()->where('service_id', $service->id)->exists();
                if (!$existe) {
                    $facture->details()->create([
                        'service_id' => $service->id,
                        'service_nom' => $service->nom,
                        'service_code' => $service->code,
                        'service_obligatoire' => $service->obligatoire,
                        'service_description' => $service->description,
                        'montant' => $service->montant,
                        'montant_paye' => 0,
                        'statut' => 'non_paye',
                    ]);
                }

                FactureHelper::recalculerTotauxFacture($facture);
            }

            DB::commit();
            Log::info("✅ Factures mises à jour pour {$inscriptions->count()} inscription(s)");

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("❌ [ServiceCiblageObserver] Erreur création ciblage : " . $e->getMessage());
        }
    }

    /**
     * 🔴 Lorsqu’un ciblage est supprimé
     */
    public function deleted(ServiceCiblage $ciblage)
    {
        try {
            DB::beginTransaction();

            $service = $ciblage->service;
            $inscriptions = $this->getInscriptionsCiblees($ciblage);
            $mois = Carbon::now()->month;
            $annee = Carbon::now()->year;

            foreach ($inscriptions as $inscription) {
                $facture = $inscription->factures()
                    ->where('mois', $mois)
                    ->where('annee', $annee)
                    ->first();

                if ($facture) {
                    $facture->details()->where('service_id', $service->id)->delete();
                    FactureHelper::recalculerTotauxFacture($facture);
                }
            }

            DB::commit();
            Log::info("🗑️ Service [{$service->nom}] supprimé du ciblage et factures mises à jour");

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("❌ [ServiceCiblageObserver] Erreur suppression ciblage : " . $e->getMessage());
        }
    }

    /**
     * ⚙️ Détermine quelles inscriptions sont concernées par le ciblage
     */
    private function getInscriptionsCiblees(ServiceCiblage $ciblage)
    {
        $type = $ciblage->ciblable_type;
        $id = $ciblage->ciblable_id;

        return match ($type) {
            'App\\Models\\Cycle' => Inscription::whereHas('classe.niveau', fn($q) => $q->where('cycle_id', $id))->get(),
            'App\\Models\\Niveau' => Inscription::whereHas('classe', fn($q) => $q->where('niveau_id', $id))->get(),
            'App\\Models\\Classe' => Inscription::where('classe_id', $id)->get(),
            'App\\Models\\Inscription' => Inscription::where('id', $id)->get(),
            default => collect(),
        };
    }
}
