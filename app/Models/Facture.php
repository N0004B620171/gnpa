<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Facture extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($model) => $model->uid = $model->uid ?? Str::uuid());
    }

    /** 🔗 Relations */
    public function inscription()
    {
        return $this->belongsTo(Inscription::class);
    }

    public function details()
    {
        return $this->hasMany(FactureDetail::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    /** 💰 Calculs utiles */
    public function getResteAttribute()
    {
        return max(0, $this->montant_total - $this->montant_paye);
    }

    /** ⚙️ Met à jour les totaux */
    public function recalculerMontants()
    {
        $total = $this->details->sum('montant');
        $paye = $this->details->sum('montant_paye');

        $this->update([
            'montant_total' => $total,
            'montant_paye'  => $paye,
            'statut'        => $paye == 0 ? 'non_paye' : ($paye < $total ? 'partiel' : 'paye'),
        ]);
    }
}
