<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class Trimestre extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];
    
    protected $casts = [
        'bareme' => 'float'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uid)) $model->uid = Str::uuid();
        });
    }

    public function anneeScolaire()
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    public function compositions()
    {
        return $this->hasMany(Composition::class);
    }

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class);
    }

    public function notes()
    {
        return $this->hasManyThrough(Note::class, Composition::class);
    }
}