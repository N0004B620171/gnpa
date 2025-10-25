<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Composition extends Model
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

    public function trimestre()
    {
        return $this->belongsTo(Trimestre::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function matieres()
    {
        return $this->belongsToMany(Matiere::class, 'composition_matieres')
            ->using(\App\Models\CompositionMatiere::class) // ✅ pivot personnalisé
            ->withTimestamps();
    }


    // Vérifier si une matière est incluse dans cette composition
    public function hasMatiere($matiereId)
    {
        return $this->matieres()->where('matiere_id', $matiereId)->exists();
    }
}
