<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PresenceTransport extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'date' => 'date',
        'heure_monte' => 'datetime:H:i',
        'heure_descente' => 'datetime:H:i',
    ];

    // 🔗 Relations
    public function affectation()
    {
        return $this->belongsTo(AffectationTransport::class, 'affectation_transport_id');
    }

    public function inscription()
    {
        return $this->hasOneThrough(
            Inscription::class,
            AffectationTransport::class,
            'id', // clé locale sur affectation_transport
            'id', // clé sur inscription
            'affectation_transport_id',
            'inscription_id'
        );
    }
}
