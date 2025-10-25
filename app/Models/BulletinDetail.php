<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

class BulletinDetail extends Model
{
    use HasFactory;

    protected $guarded = ['id', 'uid'];

    protected $casts = [
        'note' => 'decimal:2',
        'sur' => 'decimal:2',
        'note_normalisee' => 'decimal:2',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uid)) $model->uid = Str::uuid();
        });
    }

    public function bulletin()
    {
        return $this->belongsTo(Bulletin::class);
    }

    public function matiere()
    {
        return $this->belongsTo(Matiere::class);
    }
}
