<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Helpers\FactureHelper;

class Inscription extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected $casts = [
        'date_inscription' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->uid)) $model->uid = Str::uuid();
            if (empty($model->date_inscription)) $model->date_inscription = now();
        });

        static::created(function ($inscription) {
            try {
                DB::beginTransaction();

                $annee = $inscription->anneeScolaire;
                $classe = $inscription->classe;
                $cycle = $classe?->niveau?->cycle;

                if (!$annee || !$cycle) {
                    throw new \Exception("Cycle ou année scolaire introuvable pour cette inscription.");
                }

                /**
                 * 🧾 1️⃣ Génération automatique des bulletins trimestriels
                 */
                $trimestres = $annee->trimestres;
                if ($trimestres->isEmpty()) {
                    throw new \Exception("Aucun trimestre trouvé pour l'année scolaire : {$annee->nom}");
                }

                foreach ($trimestres as $trimestre) {
                    Bulletin::firstOrCreate([
                        'inscription_id' => $inscription->id,
                        'trimestre_id' => $trimestre->id,
                        'annuel' => false,
                    ], [
                        'annee_scolaire_nom' => $annee->nom,
                        'trimestre_nom' => $trimestre->nom,
                        'eleve_nom' => $inscription->eleve->prenom . ' ' . $inscription->eleve->nom,
                        'classe_nom' => $classe->nom,
                        'niveau_nom' => $classe->niveau->nom,
                        'professeur_nom' => $classe->professeur->nom_complet ?? $classe->professeur->nom ?? null,
                        'professeur_fonction' => 'Professeur principal',
                    ]);
                }

                /**
                 * 💰 2️⃣ Génération automatique des factures mensuelles
                 */
                $moisDebut = (int) date('m', strtotime($annee->date_debut));
                $moisFin = (int) date('m', strtotime($annee->date_fin));
                $anneeDebut = (int) date('Y', strtotime($annee->date_debut));

                for ($mois = $moisDebut; $mois <= $moisFin; $mois++) {
                    // Appel du helper de facturation
                    FactureHelper::creerFactureMensuelle($inscription, $mois, $anneeDebut);
                }

                DB::commit();
                Log::info("✅ Bulletins et factures générés automatiquement pour l’inscription #{$inscription->id}");
            } catch (\Throwable $e) {
                DB::rollBack();
                Log::error('❌ Erreur génération auto (Inscription.created): ' . $e->getMessage());
            }
        });
    }

    // === RELATIONS ===
    public function eleve()
    {
        return $this->belongsTo(Eleve::class, 'eleve_id');
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(AnneeScolaire::class, 'annee_scolaire_id');
    }

    public function notes()
    {
        return $this->hasMany(Note::class, 'inscription_id');
    }

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class, 'inscription_id');
    }

    public function factures()
    {
        return $this->hasMany(Facture::class, 'inscription_id');
    }

    // === SCOPES ===
    public function scopeActives($query)
    {
        return $query->where('statut', 'actif');
    }

    public function scopePourAnnee($query, $anneeScolaireId)
    {
        return $query->where('annee_scolaire_id', $anneeScolaireId);
    }

    // === OUTILS ===
    public function moyenneTrimestre($trimestreId)
    {
        $notes = $this->notes()->whereHas('composition', function ($query) use ($trimestreId) {
            $query->where('trimestre_id', $trimestreId);
        })->get();

        $totalPoints = 0;
        $totalCoefficients = 0;

        foreach ($notes as $note) {
            $coef = $note->matiere->coefficient ?? 1;
            $noteNorm = $note->sur > 0 ? ($note->note / $note->sur) * 20 : 0;
            $totalPoints += $noteNorm * $coef;
            $totalCoefficients += $coef;
        }

        return $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 2) : 0;
    }

    public function affectationTransport()
    {
        return $this->hasOne(AffectationTransport::class, 'inscription_id');
    }
}
