<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Eleve extends Model
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

    public function parentEleve()
    {
        return $this->belongsTo(ParentEleve::class, 'parent_eleve_id');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class, 'eleve_id'); // Spécifier la clé étrangère
    }

    public function notes()
    {
        return $this->hasManyThrough(
            Note::class, 
            Inscription::class,
            'eleve_id', // Clé étrangère sur la table intermédiaire (inscriptions)
            'inscription_id', // Clé étrangère sur la table finale (notes)
            'id', // Clé locale sur eleves
            'id' // Clé locale sur inscriptions
        );
    }

    public function bulletins()
    {
        return $this->hasManyThrough(
            Bulletin::class, 
            Inscription::class,
            'eleve_id', // Clé étrangère sur la table intermédiaire (inscriptions)
            'inscription_id', // Clé étrangère sur la table finale (bulletins)
            'id', // Clé locale sur eleves
            'id' // Clé locale sur inscriptions
        );
    }

    // Inscription active pour l'année en cours
    public function inscriptionActive()
    {
        return $this->hasOne(Inscription::class, 'eleve_id')->where('statut', 'actif');
    }

    // Accessor pour le nom complet
    public function getNomCompletAttribute()
    {
        return $this->prenom . ' ' . $this->nom;
    }

    // Scope pour les élèves actifs
    public function scopeActifs($query)
    {
        return $query->whereHas('inscriptions', function($q) {
            $q->where('statut', 'actif');
        });
    }
}