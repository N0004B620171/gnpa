<?php

namespace App\Helpers;

use App\Models\Bulletin;
use App\Models\BulletinDetail;
use App\Models\Trimestre;
use Dompdf\Dompdf;
use Dompdf\Options;

class BulletinHelper
{
    /**
     * Normalise une note sur 20
     */
    public static function normalize($note, $sur): float
    {
        return round(($note / max($sur, 1)) * 20, 2);
    }

    /**
     * Moyenne d’un élève sur un ensemble de notes
     */
    public static function moyenneEleve($notes)
    {
        return $notes->count()
            ? round($notes->avg(fn($n) => self::normalize($n->note, $n->sur)), 2)
            : 0;
    }

    /**
     * Moyenne de la classe
     */
    public static function moyenneClasse($moyennes)
    {
        return count($moyennes)
            ? round(array_sum($moyennes) / count($moyennes), 2)
            : 0;
    }

    /**
     * Rangs par rapport aux moyennes
     */
    public static function calculerRangs(array $moyennes): array
    {
        arsort($moyennes);
        $rangs = [];
        foreach (array_keys($moyennes) as $index => $id) {
            $rangs[$id] = $index + 1;
        }
        return $rangs;
    }

    /**
     * Moyenne annuelle (moyenne des moyennes trimestrielles)
     */
    public static function moyenneAnnuelle($bulletinsTrimestriels)
    {
        return $bulletinsTrimestriels->count()
            ? round($bulletinsTrimestriels->avg('moyenne_eleve'), 2)
            : 0;
    }

    /**
     * Génération d’un bulletin trimestriel
     */
    public static function generateTrimestriel($inscription, $trimestreId)
    {
        $notes = $inscription->notes()->where('composition_id', $trimestreId)->with('matiere')->get();
        $moyenneEleve = self::moyenneEleve($notes);

        $inscriptionsClasse = $inscription->classe->inscriptions;
        $moyennesClasse = [];
        foreach ($inscriptionsClasse as $i) {
            $n = $i->notes()->where('composition_id', $trimestreId)->get();
            $moyennesClasse[$i->id] = self::moyenneEleve($n);
        }

        $rangs = self::calculerRangs($moyennesClasse);
        $moyenneClasse = self::moyenneClasse($moyennesClasse);

        $bulletin = Bulletin::updateOrCreate(
            [
                'inscription_id' => $inscription->id,
                'trimestre_id' => $trimestreId,
                'annuel' => false,
            ],
            [
                'annee_scolaire_nom' => $inscription->anneeScolaire->nom,
                'trimestre_nom' => Trimestre::find($trimestreId)->nom,
                'eleve_nom' => $inscription->eleve->prenom . ' ' . $inscription->eleve->nom,
                'classe_nom' => $inscription->classe->nom,
                'niveau_nom' => $inscription->classe->niveau->nom,
                'moyenne_eleve' => $moyenneEleve,
                'rang' => $rangs[$inscription->id] ?? 0,
                'moyenne_classe' => $moyenneClasse,
                'professeur_nom' => $inscription->classe->professeur->nom ?? null,
                'professeur_fonction' => 'Professeur principal',
            ]
        );

        foreach ($notes as $note) {
            BulletinDetail::updateOrCreate(
                [
                    'bulletin_id' => $bulletin->id,
                    'matiere_id' => $note->matiere_id,
                ],
                [
                    'matiere_nom' => $note->matiere->nom,
                    'coefficient' => $note->matiere->coefficient,
                    'professeur_nom' => $inscription->classe->professeur->nom ?? null,
                    'note' => $note->note,
                    'sur' => $note->sur,
                    'note_normalisee' => self::normalize($note->note, $note->sur),
                    'appreciation' => $note->appreciation,
                ]
            );
        }

        return $bulletin->load('details');
    }

    /**
     * Génération d’un bulletin annuel
     */
    public static function generateAnnuel($inscription)
    {
        $bulletinsTrimestriels = $inscription->bulletins()->where('annuel', false)->get();
        $moyenneAnnuelle = self::moyenneAnnuelle($bulletinsTrimestriels);

        $classeInscriptions = $inscription->classe->inscriptions;
        $moyennesClasse = [];
        foreach ($classeInscriptions as $i) {
            $trims = $i->bulletins()->where('annuel', false)->get();
            $moyennesClasse[$i->id] = self::moyenneAnnuelle($trims);
        }

        $rangs = self::calculerRangs($moyennesClasse);
        $moyenneClasse = self::moyenneClasse($moyennesClasse);

        $bulletin = Bulletin::updateOrCreate(
            [
                'inscription_id' => $inscription->id,
                'annuel' => true,
            ],
            [
                'annee_scolaire_nom' => $inscription->anneeScolaire->nom,
                'trimestre_nom' => "Annuel",
                'eleve_nom' => $inscription->eleve->prenom . ' ' . $inscription->eleve->nom,
                'classe_nom' => $inscription->classe->nom,
                'niveau_nom' => $inscription->classe->niveau->nom,
                'moyenne_eleve' => $moyenneAnnuelle,
                'rang' => $rangs[$inscription->id] ?? 0,
                'moyenne_classe' => $moyenneClasse,
                'professeur_nom' => $inscription->classe->professeur->nom ?? null,
                'professeur_fonction' => 'Professeur principal',
            ]
        );

        $notes = $inscription->notes()->with('matiere')->get()->groupBy('matiere_id');
        foreach ($notes as $matiereId => $notesMatiere) {
            $moyenneMatiere = $notesMatiere->avg(fn($n) => self::normalize($n->note, $n->sur));
            $matiere = $notesMatiere->first()->matiere;

            BulletinDetail::updateOrCreate(
                [
                    'bulletin_id' => $bulletin->id,
                    'matiere_id' => $matiereId,
                ],
                [
                    'matiere_nom' => $matiere->nom,
                    'coefficient' => $matiere->coefficient,
                    'professeur_nom' => $inscription->classe->professeur->nom ?? null,
                    'note' => round($moyenneMatiere, 2),
                    'sur' => 20,
                    'note_normalisee' => round($moyenneMatiere, 2),
                    'appreciation' => 'Annuel',
                ]
            );
        }

        return $bulletin->load('details');
    }

    /**
     * Génération PDF bulletin (trimestriel ou annuel)
     */
    public static function generatePDF(Bulletin $bulletin, $schoolInfo = [])
    {
        // ⚠️ Ici, tu pourras remplacer par une table "schools" si multi-écoles
        $schoolInfo = array_merge([
            'nom' => config('app.school_name', 'Mon École'),
            'adresse' => config('app.school_address', 'Adresse non renseignée'),
            'telephone' => config('app.school_phone', '---'),
            'logo' => public_path('images/logo.png'),
            'directeur' => config('app.school_director', 'Le Directeur'),
        ], $schoolInfo);

        $bulletin->load('details', 'inscription.eleve', 'inscription.classe.niveau');

        $html = view('pdf.bulletin', [
            'bulletin' => $bulletin,
            'schoolInfo' => $schoolInfo,
        ])->render();

        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);

        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();

        return $dompdf->stream("bulletin-{$bulletin->eleve_nom}.pdf");
    }
}
