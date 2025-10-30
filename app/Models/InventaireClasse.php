<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class InventaireClasse extends Model
{
    use HasFactory;
    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn($i) => $i->uid = Str::uuid());
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }
    public function materiel()
    {
        return $this->belongsTo(Materiel::class);
    }
}
