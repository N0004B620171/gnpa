<?php

namespace App\Observers;

use App\Models\Composition;
use App\Helpers\BulletinHelper;
use Illuminate\Support\Facades\Log;

class CompositionObserver
{
    /**
     * Événement déclenché juste après la création d’une composition
     */
    public function created(Composition $composition)
    {
        Log::info("🧩 Composition créée #{$composition->id} — en attente d’attachement des matières");
    }

    /**
     * Événement déclenché après chaque sauvegarde (création ou mise à jour)
     */
    public function saved(Composition $composition)
    {
        try {
            // Vérifie si des matières sont déjà liées à la composition
            if ($composition->matieres()->exists()) {
                Log::info("📄 Observer : génération des bulletins pour la composition #{$composition->id}");

                // Appelle ton helper de génération des bulletins
                BulletinHelper::generateTrimestrielFromComposition($composition);
            } else {
                Log::info("⚠️ Observer : aucune matière liée à la composition #{$composition->id}, génération différée");
            }
        } catch (\Throwable $e) {
            Log::error("❌ Erreur dans CompositionObserver pour la composition #{$composition->id} : " . $e->getMessage());
        }
    }
}
