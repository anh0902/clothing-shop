<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loaisach extends Model
{
    protected $table = 'loaisach';
    protected $fillable = [
        'ten_loai'
    ];

    public $timestamps = true;

    // Relationships
    public function sachs()
    {
        return $this->hasMany(Sach::class, 'loai_sach_id');
    }
}