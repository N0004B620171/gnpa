<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Paiement extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->uid = $model->uid ?? Str::uuid();
            $model->date_paiement = $model->date_paiement ?? now();
             // Génération d’une référence si absente
            if (empty($model->reference_transaction)) {
                $model->reference_transaction = 'REF-' . strtoupper(Str::random(10));
            }
            // Numéro de reçu simple horodaté + random (tu peux le remplacer par séquence)
            if (empty($model->numero_recu)) {
                $prefix = 'REC-'.now()->format('YmdHis');
                $model->numero_recu = $prefix.'-'.strtoupper(Str::random(4));
            }
            if (empty($model->date_paiement)) {
                $model->date_paiement = now();
            }
        });

        static::created(function ($paiement) {
            // ⚙️ Met à jour les montants dans FactureDetail + Facture +
            if ($paiement->factureDetail) {
                $detail = $paiement->factureDetail;
                $detail->increment('montant_paye', $paiement->montant);
                $detail->mettreAJourStatut();
            }

         
        });
    }

    /** 🔗 Relations */
    public function facture()
    {
        return $this->belongsTo(Facture::class);
    }

    public function factureDetail()
    {
        return $this->belongsTo(FactureDetail::class);
    }
}
