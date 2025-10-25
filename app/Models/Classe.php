<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Classe extends Model
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

    public function niveau()
    {
        return $this->belongsTo(Niveau::class, 'niveau_id');
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class, 'professeur_id');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'classe_id');
    }

    public function compositions()
    {
        return $this->hasMany(Composition::class, 'classe_id');
    }

    public function elevesActuels()
    {
        return $this->hasManyThrough(
            Eleve::class, 
            Inscription::class,
            'classe_id', // Clé étrangère sur la table intermédiaire (inscriptions)
            'id', // Clé étrangère sur la table finale (eleves)
            'id', // Clé locale sur classes
            'eleve_id' // Clé locale sur inscriptions
        )->where('inscriptions.statut', 'actif');
    }

    // Méthode alternative pour récupérer les élèves actuels
    public function elevesActuelsViaInscriptions()
    {
        return $this->inscriptions()
                    ->with('eleve')
                    ->where('statut', 'actif')
                    ->get()
                    ->pluck('eleve');
    }

    // Accessor pour le nom complet de la classe
    public function getNomCompletAttribute()
    {
        return $this->niveau ? $this->niveau->nom . ' ' . $this->nom : $this->nom;
    }

    public function matieres()
    {
        return $this->hasMany(Matiere::class, 'classe_id');
    }

    // Scope pour les classes avec des élèves actifs
    public function scopeAvecElevesActifs($query)
    {
        return $query->whereHas('inscriptions', function($q) {
            $q->where('statut', 'actif');
        });
    }
}