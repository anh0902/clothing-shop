<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chitietphieunhap extends Model
{
    protected $table = 'chitietphieunhap';
    protected $fillable = [
        'phieu_nhap_id',
        'sach_id',
        'so_luong',
        'don_gia_du_kien'
    ];

    public $timestamps = false;

    public function phieunhap()
    {
        return $this->belongsTo(Phieunhap::class, 'phieu_nhap_id');
    }

    public function sach()
    {
        return $this->belongsTo(Sach::class, 'sach_id');
    }
}