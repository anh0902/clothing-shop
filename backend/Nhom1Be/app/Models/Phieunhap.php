<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Phieunhap extends Model
{
    protected $table = 'phieunhap';
    protected $fillable = [
        'ngay_nhap',
        'tong_tien',
        'trang_thai'
    ];

    public $timestamps = false;
    protected $dates = ['ngay_nhap'];

    // Relationships
    public function chitietphieunhaps()
    {
        return $this->hasMany(Chitietphieunhap::class, 'phieu_nhap_id');
    }
}