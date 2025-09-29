<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ParentEleve extends Model
{
    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($parentEleve) {
            if (empty($parentEleve->uid)) {
                $parentEleve->uid = Str::uuid();
            }
        });
    }
    public function eleves()
    {
        return $this->hasMany(Eleve::class, 'parent_id');
    }

    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }
}
