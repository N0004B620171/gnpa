<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Buse extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($buse) {
            if (empty($buse->uid)) $buse->uid = Str::uuid();
        });
    }

    // 🔗 Relations
    public function itineraireTransport()
    {
        return $this->hasMany(ItineraireTransport::class, 'buse_id');
    }

    // Optionnel : pour voir le nombre d’élèves transportés via ses itinéraires
    public function affectationTransports()
    {
        return $this->hasManyThrough(AffectationTransport::class, ItineraireTransport::class, 'buse_id', 'itineraire_transport_id');
    }
}
