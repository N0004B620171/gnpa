<?php

namespace App\Observers;

use App\Models\Note;
use App\Helpers\BulletinHelper;
use Illuminate\Support\Facades\Log;

class NoteObserver
{
    /**
     * 🔹 Lorsqu'une note est créée
     */
    public function created(Note $note)
    {
        $this->majBulletin($note, '🟢 Nouvelle note enregistrée');
    }

    /**
     * 🔸 Lorsqu'une note est mise à jour
     */
    public function updated(Note $note)
    {
        $this->majBulletin($note, '🟡 Note mise à jour');
    }

    /**
     * 🔴 Lorsqu'une note est supprimée
     */
    public function deleted(Note $note)
    {
        $this->majBulletin($note, '🔴 Note supprimée');
    }

    /**
     * ⚙️ Mise à jour automatique du bulletin concerné
     */
    protected function majBulletin(Note $note, string $action)
    {
        try {
            Log::info("{$action} — Recalcul du bulletin pour l’élève ID {$note->inscription_id}, matière ID {$note->matiere_id}");

            // Charger la composition avec les relations nécessaires
            $composition = $note->composition()
                ->with([
                    'trimestre.anneeScolaire',
                    'classe.inscriptions.eleve',
                    'classe.niveau',
                    'classe.professeur',
                    'matieres.professeur',
                ])
                ->first();

            if (!$composition) {
                Log::warning("⚠️ Impossible de recalculer : composition introuvable pour la note #{$note->id}");
                return;
            }

            // Génération / mise à jour du bulletin
            BulletinHelper::generateTrimestrielFromComposition($composition);

            Log::info("✅ Bulletin mis à jour suite à {$action} (note #{$note->id})");
        } catch (\Throwable $e) {
            Log::error("❌ Erreur dans NoteObserver (note #{$note->id}) : " . $e->getMessage());
        }
    }
}
