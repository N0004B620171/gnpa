<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ItineraireTransport extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($itineraire) {
            if (empty($itineraire->uid)) $itineraire->uid = Str::uuid();
        });
    }

    // 🔗 Relations
    public function bus()
    {
        return $this->belongsTo(Buse::class);
    }

    public function arrets()
    {
        return $this->hasMany(Arret::class, 'itineraire_transport_id');
    }

    public function affectationTransports()
    {
        return $this->hasMany(AffectationTransport::class, 'itineraire_transport_id');
    }

    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }
}
