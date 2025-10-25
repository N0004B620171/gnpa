<?php

namespace App\Helpers;

use App\Models\{
    Facture,
    FactureDetail,
    ServiceCiblage,
    AffectationTransport,
    Inscription
};
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class FactureHelper
{
    /**
     * 🧾 Crée une facture mensuelle pour une inscription donnée
     * avec tous les services applicables (cycle, niveau, classe, inscription, transport…)
     */
    public static function creerFactureMensuelle(Inscription $inscription, int $mois, int $annee)
    {
        try {
            DB::beginTransaction();

            Log::info("📄 [FactureHelper] Création facture mensuelle pour inscription #{$inscription->id} - {$mois}/{$annee}");

            // 🔍 Vérifie si la facture existe déjà
            $facture = Facture::firstOrCreate(
                [
                    'inscription_id' => $inscription->id,
                    'mois' => $mois,
                    'annee' => $annee,
                ],
                [
                    'eleve_nom' => $inscription->eleve->prenom . ' ' . $inscription->eleve->nom,
                    'classe_nom' => $inscription->classe->nom,
                    'niveau_nom' => $inscription->classe->niveau->nom,
                    'annee_scolaire_nom' => $inscription->anneeScolaire->nom,
                    'montant_total' => 0,
                    'montant_paye' => 0,
                    'statut' => 'non_paye',
                ]
            );

            // ⚙️ Récupère tous les services applicables
            $services = self::getServicesApplicables($inscription);

            $total = 0;

            foreach ($services as $service) {
                $detail = FactureDetail::firstOrCreate(
                    [
                        'facture_id' => $facture->id,
                        'service_id' => $service->id,
                    ],
                    [
                        'service_nom' => $service->nom,
                        'service_code' => $service->code,
                        'service_obligatoire' => $service->obligatoire,
                        'service_description' => $service->description,
                        'montant' => $service->montant,
                        'montant_paye' => 0,
                        'statut' => 'non_paye',
                    ]
                );

                $total += $detail->montant;
            }

            // 💰 Mise à jour du total facture
            $facture->update([
                'montant_total' => $total,
                'montant_restant' => $total - ($facture->montant_paye ?? 0),
            ]);

            DB::commit();

            Log::info("✅ [FactureHelper] Facture #{$facture->id} générée ({$total} F) pour {$inscription->eleve->nom}");
            return $facture;
        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error("❌ [FactureHelper] Erreur création facture : " . $e->getMessage());
            return null;
        }
    }

    /**
     * 🧠 Récupère tous les services applicables à une inscription :
     * cycle, niveau, classe, inscription, et transport actif.
     */
    public static function getServicesApplicables(Inscription $inscription)
    {
        $cycleId = $inscription->classe?->niveau?->cycle_id;
        $niveauId = $inscription->classe?->niveau_id;
        $classeId = $inscription->classe_id;
        $inscriptionId = $inscription->id;

        $services = collect();

        // 🔹 Services ciblés via ServiceCiblage
        $ciblages = ServiceCiblage::with('service')
            ->where(function ($q) use ($cycleId, $niveauId, $classeId, $inscriptionId) {
                $q->where(function ($query) use ($cycleId, $niveauId, $classeId, $inscriptionId) {
                    if ($cycleId) $query->orWhere([
                        'ciblable_type' => \App\Models\Cycle::class,
                        'ciblable_id' => $cycleId,
                    ]);
                    if ($niveauId) $query->orWhere([
                        'ciblable_type' => \App\Models\Niveau::class,
                        'ciblable_id' => $niveauId,
                    ]);
                    if ($classeId) $query->orWhere([
                        'ciblable_type' => \App\Models\Classe::class,
                        'ciblable_id' => $classeId,
                    ]);
                    if ($inscriptionId) $query->orWhere([
                        'ciblable_type' => \App\Models\Inscription::class,
                        'ciblable_id' => $inscriptionId,
                    ]);
                });
            })
            ->get();

        foreach ($ciblages as $ciblage) {
            if ($ciblage->service && $ciblage->service->actif) {
                $services->push($ciblage->service);
            }
        }

        // 🔹 Service Transport (affectation active)
        $affectation = AffectationTransport::where('inscription_id', $inscription->id)
            ->where('actif', true)
            ->with('itineraireTransport.service')
            ->first();

        if ($affectation && $affectation->itineraireTransport?->service) {
            $service = $affectation->itineraireTransport->service;
            if ($service->actif) {
                $services->push($service);
            }
        }

        return $services->unique('id')->values();
    }

    /**
     * 🔁 Met à jour les totaux et le statut d'une facture complète
     */
    public static function recalculerTotauxFacture(Facture $facture)
    {
        $total = $facture->details()->sum('montant');
        $paye = $facture->details()->sum('montant_paye');
        $restant = max(0, $total - $paye);

        $statut = 'non_paye';
        if ($paye >= $total && $total > 0) {
            $statut = 'paye';
        } elseif ($paye > 0 && $paye < $total) {
            $statut = 'partiel';
        }

        $facture->update([
            'montant_total' => $total,
            'montant_paye' => $paye,
            'montant_restant' => $restant,
            'statut' => $statut,
        ]);

        Log::info("📊 Facture #{$facture->id} mise à jour → total={$total}, payé={$paye}, restant={$restant}, statut={$statut}");
    }

    /**
     * 📆 Génère toutes les factures mensuelles de l’année pour une inscription
     */
    public static function genererFacturesAnnuelles(Inscription $inscription)
    {
        $annee = $inscription->anneeScolaire;
        if (!$annee) return;

        $moisDebut = (int) date('m', strtotime($annee->date_debut));
        $moisFin = (int) date('m', strtotime($annee->date_fin));
        $anneeDebut = (int) date('Y', strtotime($annee->date_debut));

        for ($mois = $moisDebut; $mois <= $moisFin; $mois++) {
            self::creerFactureMensuelle($inscription, $mois, $anneeDebut);
        }

        Log::info("📅 [FactureHelper] Factures annuelles générées pour inscription #{$inscription->id}");
    }
}
