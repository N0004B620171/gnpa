<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Eleve extends Model
{
    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($eleve) {
            if (empty($eleve->uid)) {
                $eleve->uid = Str::uuid();
            }
        });
    }
}
