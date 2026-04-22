<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chitietdonhang extends Model
{
    protected $table = 'chitietdonhang';
    protected $fillable = [
        'don_hang_id',
        'sach_id',
        'so_luong',
        'don_gia',
        'thanh_tien'
    ];

    public $incrementing = false;
    protected $primaryKey = null;

    public $timestamps = false;

    public function donhang()
    {
        return $this->belongsTo(Donhang::class, 'don_hang_id');
    }

    public function sach()
    {
        return $this->belongsTo(Sach::class, 'sach_id');
    }
}