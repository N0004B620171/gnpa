<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Arret extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($arret) {
            if (empty($arret->uid)) $arret->uid = Str::uuid();
        });
    }

    public function itineraire()
    {
        return $this->belongsTo(ItineraireTransport::class, 'itineraire_transport_id');
    }

    public function affectations()
    {
        return $this->hasMany(AffectationTransport::class, 'arret_id');
    }
}
