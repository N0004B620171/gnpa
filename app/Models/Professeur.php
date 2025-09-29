<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Professeur extends Model
{
    use HasFactory;
    protected $guarded = ['id', 'uid'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($professeur) {
            if (empty($professeur->uid)) {
                $professeur->uid = Str::uuid();
            }
        });
    }

    public function user()
    {
        return $this->morphOne(User::class, 'userable');
    }
}
