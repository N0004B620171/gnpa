<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Inscription extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uid)) $model->uid = Str::uuid();
        });
    }

    public function eleve()
    {
        return $this->belongsTo(Eleve::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class);
    }

    // Moyenne générale de l'élève pour un trimestre
    public function moyenneTrimestre($trimestreId)
    {
        $notes = $this->notes()->whereHas('composition', function($query) use ($trimestreId) {
            $query->where('trimestre_id', $trimestreId);
        })->get();
        
        // Calcul de la moyenne pondérée
        $totalPoints = 0;
        $totalCoefficients = 0;
        
        foreach ($notes as $note) {
            $coefficient = $note->matiere->coefficient;
            $totalPoints += $note->note_normalisee * $coefficient;
            $totalCoefficients += $coefficient;
        }
        
        return $totalCoefficients > 0 ? $totalPoints / $totalCoefficients : 0;
    }
}