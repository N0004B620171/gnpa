<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class HistoriqueTransfert extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($historique) {
            if (empty($historique->uid)) {
                $historique->uid = Str::uuid();
            }
        });
    }

    // 🔗 Relations
    public function ancienneAnnee()
    {
        return $this->belongsTo(AnneeScolaire::class, 'ancienne_annee_id');
    }

    public function nouvelleAnnee()
    {
        return $this->belongsTo(AnneeScolaire::class, 'nouvelle_annee_id');
    }

    // 🔍 Helpers pour décoder les JSON
    public function getNouveauxInscriptionsAttribute()
    {
        return json_decode($this->nouveaux_inscriptions_ids, true) ?? [];
    }

    public function getTransfertsAttribute()
    {
        return json_decode($this->transferts_ids, true) ?? [];
    }

    // 🔎 État du transfert
    public function getPeutAnnulerAttribute()
    {
        return $this->annulable === true;
    }

    // 🔁 Relation logique inverse (si besoin)
    public function transferts()
    {
        return TransfertAnnee::whereIn('id', $this->getTransfertsAttribute())->get();
    }
}
