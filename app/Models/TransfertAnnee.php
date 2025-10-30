<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class TransfertAnnee extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($transfert) {
            if (empty($transfert->uid)) {
                $transfert->uid = Str::uuid();
            }
        });
    }

    // 🔗 Relations principales
    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    public function ancienneAnnee()
    {
        return $this->belongsTo(AnneeScolaire::class, 'ancienne_annee_id');
    }

    public function nouvelleAnnee()
    {
        return $this->belongsTo(AnneeScolaire::class, 'nouvelle_annee_id');
    }

    public function nouvelleClasse()
    {
        return $this->belongsTo(Classe::class, 'nouvelle_classe_id');
    }

    // 🔎 Accessor pour un libellé lisible
    public function getStatutLabelAttribute()
    {
        return match ($this->statut) {
            'passant' => 'Passant',
            'redoublant' => 'Redoublant',
            'sortant' => 'Sortant',
            default => ucfirst($this->statut),
        };
    }
}
