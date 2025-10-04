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

    public function parent()
    {
        return $this->belongsTo(ParentEleve::class, 'parent_eleve_id');
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function notes()
    {
        return $this->hasManyThrough(Note::class, Inscription::class);
    }

    public function bulletins()
    {
        return $this->hasManyThrough(Bulletin::class, Inscription::class);
    }

    // Inscription active pour l'année en cours
    public function inscriptionActive()
    {
        return $this->hasOne(Inscription::class)->where('statut', 'actif');
    }
}