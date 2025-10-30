<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Materiel extends Model
{
    use HasFactory;
    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($m) => $m->uid = Str::uuid());
    }

    public function inventaireClasses()
    {
        return $this->hasMany(InventaireClasse::class);
    }

    public function inventaireEnseignants()
    {
        return $this->hasMany(InventaireEnseignant::class);
    }
}
