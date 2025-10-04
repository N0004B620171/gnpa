<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Note extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected $casts = [
        'note' => 'float',
        'sur' => 'float'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uid)) $model->uid = Str::uuid();
        });
        
        static::saving(function ($model) {
            if ($model->sur <= 0) {
                throw new \Exception("La valeur 'sur' doit être positive");
            }
        });
    }

    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    public function composition()
    {
        return $this->belongsTo(Composition::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }

    // Accès à l'élève via l'inscription
    public function eleve()
    {
        return $this->hasOneThrough(Eleve::class, Inscription::class, 'id', 'id', 'inscription_id', 'eleve_id');
    }

    public function getNoteNormaliseeAttribute()
    {
        $bareme = $this->composition->trimestre->bareme ?? 20;
        return $this->sur > 0 ? ($this->note / $this->sur) * $bareme : 0;
    }

    // Pourcentage de réussite
    public function getPourcentageAttribute()
    {
        return $this->sur > 0 ? ($this->note / $this->sur) * 100 : 0;
    }
}