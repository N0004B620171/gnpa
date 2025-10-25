<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AffectationTransport extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($affectation) {
            if (empty($affectation->uid)) $affectation->uid = Str::uuid();
        });

        // 🚀 Lorsqu’un élève est affecté à un itinéraire → générer sa facture transport
        static::created(function ($affectation) {
            try {
                $inscription = $affectation->inscription;
                $itineraire = $affectation->itineraire;
                $service = $itineraire->service;

                if (!$service) {
                    Log::warning("Aucun service associé à l'itinéraire #{$itineraire->id}");
                    return;
                }

                // ✅ Création automatique de la facture mensuelle transport
                app('App\Helpers\FactureHelper')::creerFactureMensuelleTransport($inscription, $service, now()->month, now()->year);

                Log::info("🧾 Facture transport générée pour élève #{$inscription->id}");
            } catch (\Throwable $e) {
                Log::error("❌ Erreur génération facture transport : " . $e->getMessage());
            }
        });
    }

    // 🔗 Relations
    public function inscription()
    {
        return $this->belongsTo(Inscription::class, 'inscription_id');
    }

    public function itineraireTransport()
    {
        return $this->belongsTo(ItineraireTransport::class, 'itineraire_transport_id');
    }

    public function arret()
    {
        return $this->belongsTo(Arret::class, 'arret_id');
    }

    public function presenceTransports()
    {
        return $this->hasMany(PresenceTransport::class, 'affectation_transport_id');
    }
}
