<?php

namespace App\Helpers;

use App\Models\ServiceCiblage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class ServiceCiblageHelper
{
    /**
     * Associe un service à une cible (Cycle, Niveau, Classe ou Inscription)
     *
     * @param  int     $serviceId
     * @param  string  $ciblableType  (ex: App\Models\Inscription)
     * @param  int     $ciblableId
     * @return array   [success => bool, message => string]
     */
    public static function associerService(int $serviceId, string $ciblableType, int $ciblableId): array
    {
        DB::beginTransaction();

        try {
            // ✅ Validation de base
            if (!class_exists($ciblableType)) {
                throw new Exception("Le type ciblé ($ciblableType) est invalide.");
            }

            // 🔍 Vérifie si l'association existe déjà
            $existe = ServiceCiblage::where([
                'service_id' => $serviceId,
                'ciblable_type' => $ciblableType,
                'ciblable_id' => $ciblableId,
            ])->exists();

            if ($existe) {
                return [
                    'success' => false,
                    'message' => 'Ce service est déjà associé à cet élément.'
                ];
            }

            // ✅ Création du ciblage
            ServiceCiblage::create([
                'uid' => Str::uuid(),
                'service_id' => $serviceId,
                'ciblable_type' => $ciblableType,
                'ciblable_id' => $ciblableId,
            ]);

            DB::commit();

            return [
                'success' => true,
                'message' => 'Service associé avec succès.'
            ];

        } catch (\Throwable $e) {
            DB::rollBack();

            return [
                'success' => false,
                'message' => 'Erreur : ' . $e->getMessage()
            ];
        }
    }

    /**
     * Dissocie un service ciblé existant
     *
     * @param  \App\Models\ServiceCiblage  $serviceCiblage
     * @return array
     */
    public static function dissocierService(ServiceCiblage $serviceCiblage): array
    {
        DB::beginTransaction();
        try {
            $serviceCiblage->delete();

            DB::commit();
            return [
                'success' => true,
                'message' => 'Service dissocié avec succès.'
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            return [
                'success' => false,
                'message' => 'Erreur : ' . $e->getMessage()
            ];
        }
    }
}
