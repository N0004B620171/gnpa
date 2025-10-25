<?php

namespace App\Helpers;

use App\Models\Bulletin;
use App\Models\BulletinDetail;
use App\Models\Trimestre;
use Illuminate\Support\Facades\Log;
use Dompdf\Dompdf;
use Dompdf\Options;

class BulletinHelper
{
    /**
     * ✅ Normalise une note sur 20
     */
    public static function normalize($note, $sur): float
    {
        return round(($note / max($sur, 1)) * 20, 2);
    }

    /**
     * ✅ Moyenne d'un élève sur un ensemble de notes
     */
    public static function moyenneEleve($notes)
    {
        if ($notes->count() === 0) return 0;
        $valid = $notes->filter(fn($n) => !is_null($n->note));
        if ($valid->count() === 0) return 0;

        return round($valid->avg(fn($n) => self::normalize($n->note, $n->sur)), 2);
    }

    /**
     * ✅ Moyenne de la classe
     */
    public static function moyenneClasse($moyennes)
    {
        $valid = array_filter($moyennes, fn($m) => !is_null($m));
        return count($valid) > 0 ? round(array_sum($valid) / count($valid), 2) : null;
    }

    /**
     * ✅ Calcul des rangs
     */
    public static function calculerRangs(array $moyennes): array
    {
        arsort($moyennes);
        $rangs = [];
        $rang = 1;
        $prev = null;
        $same = 0;

        foreach ($moyennes as $id => $m) {
            if ($m === $prev) {
                $same++;
            } else {
                $rang += $same;
                $same = 1;
            }
            $rangs[$id] = $rang;
            $prev = $m;
        }

        return $rangs;
    }

    /**
     * ✅ Génère ou met à jour les bulletins trimestriels
     * à partir d'une composition donnée.
     */
    public static function generateTrimestrielFromComposition($composition)
    {
        try {
            Log::info("📄 Génération bulletins à partir de la composition #{$composition->id}");

            $trimestre = $composition->trimestre()->with('anneeScolaire')->first();
            $classe = $composition->classe()->with(['niveau', 'professeur', 'inscriptions.eleve'])->first();
            $matieres = $composition->matieres()->with('professeur')->get();

            if (!$trimestre || !$classe) {
                Log::warning("⚠️ Composition incomplète (classe ou trimestre manquant)");
                return;
            }

            foreach ($classe->inscriptions as $inscription) {
                // 🔹 Créer ou récupérer le bulletin
                $bulletin = Bulletin::firstOrCreate(
                    [
                        'inscription_id' => $inscription->id,
                        'trimestre_id' => $trimestre->id,
                        'annuel' => false,
                    ],
                    [
                        'annee_scolaire_nom' => $trimestre->anneeScolaire->nom,
                        'trimestre_nom' => $trimestre->nom,
                        'eleve_nom' => $inscription->eleve->prenom . ' ' . $inscription->eleve->nom,
                        'classe_nom' => $classe->nom,
                        'niveau_nom' => $classe->niveau->nom,
                        'professeur_nom' => $classe->professeur->nom_complet ?? $classe->professeur->nom ?? null,
                        'professeur_fonction' => 'Professeur principal',
                    ]
                );

                // 📘 Pour chaque matière liée à la composition
                foreach ($matieres as $matiere) {
                    $note = $composition->notes()
                        ->where('inscription_id', $inscription->id)
                        ->where('matiere_id', $matiere->id)
                        ->first();

                    $noteValue = $note->note ?? null;
                    $sur = $note->sur ?? 20;
                    $noteNormalisee = $noteValue !== null ? round(($noteValue / max($sur, 1)) * 20, 2) : null;

                    BulletinDetail::updateOrCreate(
                        [
                            'bulletin_id' => $bulletin->id,
                            'matiere_id' => $matiere->id,
                        ],
                        [
                            'matiere_nom' => $matiere->nom,
                            'coefficient' => $matiere->coefficient,
                            'professeur_nom' => $matiere->professeur->nom_complet ?? $matiere->professeur->nom ?? null,
                            'note' => $noteValue,
                            'sur' => $sur,
                            'note_normalisee' => $noteNormalisee,
                            'appreciation' => $note->appreciation ?? null,
                        ]
                    );
                }

                // ⚖️ Calcul moyenne générale
                $details = $bulletin->details()->get();
                $valid = $details->filter(fn($d) => !is_null($d->note_normalisee));

                if ($valid->count() > 0) {
                    $total = $valid->sum(fn($d) => $d->note_normalisee * $d->coefficient);
                    $coefTotal = $valid->sum('coefficient');
                    $moyenne = $coefTotal > 0 ? round($total / $coefTotal, 2) : null;
                    $bulletin->update(['moyenne_eleve' => $moyenne]);
                } else {
                    $bulletin->update(['moyenne_eleve' => null]);
                }
            }

            // 🎯 Mise à jour rangs et moyennes de classe
            self::updateClasseStats($classe, $trimestre);

            Log::info("✅ Bulletins mis à jour pour la composition #{$composition->id}");
        } catch (\Throwable $e) {
            Log::error("❌ Erreur génération bulletins : " . $e->getMessage());
        }
    }

    /**
     * ✅ Met à jour les moyennes et rangs de tous les bulletins d’une classe sur un trimestre.
     */
    public static function updateClasseStats($classe, $trimestre)
    {
        try {
            $bulletins = Bulletin::whereHas('inscription', fn($q) =>
                $q->where('classe_id', $classe->id)
            )
                ->where('trimestre_id', $trimestre->id)
                ->where('annuel', false)
                ->get();

            if ($bulletins->isEmpty()) return;

            $moyennes = [];
            foreach ($bulletins as $b) {
                if (!is_null($b->moyenne_eleve)) $moyennes[$b->id] = $b->moyenne_eleve;
            }

            if (empty($moyennes)) return;

            $rangs = self::calculerRangs($moyennes);
            $moyClasse = self::moyenneClasse($moyennes);

            foreach ($bulletins as $b) {
                $b->update([
                    'rang' => $rangs[$b->id] ?? null,
                    'moyenne_classe' => $moyClasse,
                ]);
            }

            Log::info("📊 Rangs & moyennes de classe mis à jour ({$classe->nom}, {$trimestre->nom})");
        } catch (\Throwable $e) {
            Log::error("❌ Erreur updateClasseStats : " . $e->getMessage());
        }
    }

    /**
     * ✅ Génération PDF bulletin
     */
    public static function generatePDF(Bulletin $bulletin, $schoolInfo = [])
    {
        $schoolInfo = array_merge([
            'nom' => config('app.school_name', 'École Moderne'),
            'adresse' => config('app.school_address', '123 Rue de l\'Éducation'),
            'telephone' => config('app.school_phone', '+221 77 000 00 00'),
            'logo' => public_path('images/logo.png'),
            'directeur' => config('app.school_director', 'Le Directeur'),
        ], $schoolInfo);

        $bulletin->load('details.matiere', 'inscription.eleve', 'inscription.classe.niveau');

        if (!view()->exists('pdf.bulletin')) {
            throw new \Exception("Vue PDF manquante : resources/views/pdf/bulletin.blade.php");
        }

        $html = view('pdf.bulletin', compact('bulletin', 'schoolInfo'))->render();

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'DejaVu Sans');

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html, 'UTF-8');
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        $filename = preg_replace(
            '/[^a-zA-Z0-9-_\.]/',
            '_',
            "bulletin-{$bulletin->eleve_nom}-{$bulletin->trimestre_nom}-" . date('Y-m-d') . ".pdf"
        );

        return $dompdf->stream($filename, ['Attachment' => true]);
    }
}
