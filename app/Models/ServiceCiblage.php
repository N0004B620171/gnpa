<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class ServiceCiblage extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();
        static::creating(fn ($model) => $model->uid = $model->uid ?? Str::uuid());
    }

    /** 🔗 Relations */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function ciblable()
    {
        return $this->morphTo();
    }
}
