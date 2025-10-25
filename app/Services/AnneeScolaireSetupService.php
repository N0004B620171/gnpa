<?php

namespace App\Services;

use App\Models\AnneeScolaire;
use App\Models\Trimestre;
use App\Models\Composition;
use App\Models\Classe;
use App\Models\Inscription;
use App\Models\Bulletin;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnneeScolaireSetupService
{
    public function initialiser(AnneeScolaire $annee)
    {
        DB::transaction(function () use ($annee) {

            // 1️⃣ Créer les trimestres selon le cycle
            $this->creerTrimestres($annee);

            // 2️⃣ Générer les compositions selon le type d'année
            $this->creerCompositions($annee);

            // 3️⃣ Créer les bulletins initiaux (vides)
            $this->creerBulletinsInitiaux($annee);
        });
    }

    private function creerTrimestres(AnneeScolaire $annee)
    {
        $cycles = [
            'Primaire' => 3,
            'Collège'  => 2,
        ];

        $dureeMois = Carbon::parse($annee->date_debut)->diffInMonths($annee->date_fin);
        $nbTrimestres = 3; // par défaut
        $moisParTrimestre = floor($dureeMois / $nbTrimestres);

        for ($i = 1; $i <= $nbTrimestres; $i++) {
            $annee->trimestres()->create([
                'numero' => $i,
                'nom' => "{$i}ᵉ Trimestre",
                'date_debut' => Carbon::parse($annee->date_debut)->addMonths($moisParTrimestre * ($i - 1)),
                'date_fin' => $i < $nbTrimestres
                    ? Carbon::parse($annee->date_debut)->addMonths($moisParTrimestre * $i)->subDay()
                    : $annee->date_fin,
                'bareme' => 20,
                'mark_as_last' => $i === $nbTrimestres,
            ]);
        }
    }

    private function creerCompositions(AnneeScolaire $annee)
    {
        $langues = match ($annee->type_annee) {
            'standard' => ['FR'],
            'bilingue' => ['FR', 'AR'],
            'trilingue' => ['FR', 'AR', 'EN'],
        };

        foreach ($annee->trimestres as $trimestre) {
            foreach (Classe::all() as $classe) {
                foreach ($langues as $langue) {
                    Composition::create([
                        'trimestre_id' => $trimestre->id,
                        'classe_id' => $classe->id,
                        'langue' => $langue,
                        'nom' => "Composition {$langue} - {$trimestre->nom}",
                    ]);
                }
            }
        }
    }

    private function creerBulletinsInitiaux(AnneeScolaire $annee)
    {
        $trimestres = $annee->trimestres;
        $inscriptions = Inscription::with(['eleve', 'classe.niveau'])
            ->where('annee_scolaire_id', $annee->id)
            ->get();

        foreach ($trimestres as $trimestre) {
            foreach ($trimestre->compositions as $composition) {
                foreach ($inscriptions->where('classe_id', $composition->classe_id) as $inscription) {
                    Bulletin::firstOrCreate([
                        'inscription_id' => $inscription->id,
                        'trimestre_id' => $trimestre->id,
                        'langue' => $composition->langue,
                    ], [
                        'annee_scolaire_nom' => $annee->nom,
                        'trimestre_nom' => $trimestre->nom,
                        'eleve_nom' => "{$inscription->eleve->prenom} {$inscription->eleve->nom}",
                        'classe_nom' => $inscription->classe->nom,
                        'niveau_nom' => $inscription->classe->niveau->nom,
                    ]);
                }
            }
        }
    }
}
