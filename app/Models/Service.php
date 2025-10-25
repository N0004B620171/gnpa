<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Service extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($model) => $model->uid = $model->uid ?? Str::uuid());
    }

    /** 🔗 Relations */
    public function ciblages()
    {
        return $this->hasMany(ServiceCiblage::class);
    }

    public function factureDetails()
    {
        return $this->hasMany(FactureDetail::class);
    }
    public function itineraireTransports()
    {
        return $this->hasMany(ItineraireTransport::class);
    }
}
