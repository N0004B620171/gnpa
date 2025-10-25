<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Langue extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];


    // Génération automatique du UID
    protected static function booted()
    {
        static::creating(function ($langue) {
            $langue->uid = $langue->uid ?? Str::uuid();
        });
    }

    // 🔗 Relation : une langue peut appartenir à plusieurs cycles
    public function cycles()
    {
        return $this->belongsToMany(Cycle::class, 'cycle_langue')
            ->withTimestamps();
    }
}
