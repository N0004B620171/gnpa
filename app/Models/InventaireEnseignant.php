<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class InventaireEnseignant extends Model
{
    use HasFactory;
    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($i) => $i->uid = Str::uuid());
    }

    public function professeur()
    {
        return $this->belongsTo(Professeur::class);
    }
    public function materiel()
    {
        return $this->belongsTo(Materiel::class);
    }
}
