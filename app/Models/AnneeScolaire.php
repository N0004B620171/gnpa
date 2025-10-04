<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class AnneeScolaire extends Model
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

    public function trimestres()
    {
        return $this->hasMany(Trimestre::class);
    }

    public function inscriptions()
    {
        return $this->hasMany(Inscription::class);
    }

    public function compositions()
    {
        return $this->hasManyThrough(Composition::class, Trimestre::class);
    }

    // Année scolaire active
    public static function active()
    {
        return static::where('actif', true)->first();
    }
}