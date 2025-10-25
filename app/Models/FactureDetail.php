<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class FactureDetail extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($model) => $model->uid = $model->uid ?? Str::uuid());
    }

    /** 🔗 Relations */
    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    /** 💰 Helpers */
    public function getResteAttribute()
    {
        return max(0, $this->montant - $this->montant_paye);
    }

    /** ⚙️ Mise à jour du statut */
    public function mettreAJourStatut()
    {
        $this->update([
            'statut' => match (true) {
                $this->montant_paye == 0 => 'non_paye',
                $this->montant_paye < $this->montant => 'partiel',
                default => 'paye',
            }
        ]);
        $this->facture->recalculerMontants();
    }
}
