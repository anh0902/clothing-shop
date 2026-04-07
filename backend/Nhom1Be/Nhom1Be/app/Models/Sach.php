<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sach extends Model
{
    protected $table = 'sach';
    protected $fillable = [
        'ten_sach',
        'tac_gia',
        'nha_xuat_ban',
        'gia',
        'so_luong',
        'trong_luong',
        'kich_thuoc',
        'so_trang',
        'mo_ta',
        'anh_bia',
        'trang_thai',
        'loai_sach_id'
    ];

    public $timestamps = false;

    // Relationships
    public function loaisach()
    {
        return $this->belongsTo(Loaisach::class, 'loai_sach_id');
    }

    public function chitietdonhangs()
    {
        return $this->hasMany(Chitietdonhang::class, 'sach_id');
    }

    public function chitietgiohangs()
    {
        return $this->hasMany(Chitietgiohang::class, 'sach_id');
    }

    public function chitietphieunhaps()
    {
        return $this->hasMany(Chitietphieunhap::class, 'sach_id');
    }
}