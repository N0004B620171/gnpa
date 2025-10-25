<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Cycle extends Model
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

    public function niveaux()
    {
        return $this->hasMany(Niveau::class);
    }

    public function langues()
    {
        return $this->belongsToMany(Langue::class, 'cycle_langue')
            ->withTimestamps();
    }
    public function nombreLanguesAutorise(): int
    {
        return match ($this->systeme) {
            'standard' => 1,
            'bilingue' => 2,
            'trilingue' => 3,
            default => 1,
        };
    }

    public function getSystemeLabelAttribute(): string
    {
        return match ($this->systeme) {
            'standard' => 'Standard',
            'bilingue' => 'Bilingue',
            'trilingue' => 'Trilingue',
            default => 'Inconnu',
        };
    }
}
