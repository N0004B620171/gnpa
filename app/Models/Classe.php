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
        return $this->belongsTo(Niveau::class);
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function compositions()
    {
        return $this->hasMany(Composition::class);
    }

    public function elevesActuels()
    {
        return $this->hasManyThrough(Eleve::class, Inscription::class)
                    ->where('inscriptions.statut', 'actif');
    }
}