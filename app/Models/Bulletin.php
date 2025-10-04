<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Bulletin extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected $casts = [
        'moyenne_eleve' => 'float',
        'moyenne_classe' => 'float',
        'annuel' => 'boolean'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uid)) $model->uid = Str::uuid();
        });
    }

    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    public function trimestre()
    {
        return $this->belongsTo(Trimestre::class);
    }

    public function details()
    {
        return $this->hasMany(BulletinDetail::class);
    }

    // Élève via l'inscription
    public function eleve()
    {
        return $this->hasOneThrough(Eleve::class, Inscription::class, 'id', 'id', 'inscription_id', 'eleve_id');
    }

    // Classe via l'inscription
    public function classe()
    {
        return $this->hasOneThrough(Classe::class, Inscription::class, 'id', 'id', 'inscription_id', 'classe_id');
    }
}