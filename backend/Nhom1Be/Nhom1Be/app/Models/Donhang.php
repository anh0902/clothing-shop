<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donhang extends Model
{
    protected $table = 'donhang';
    protected $fillable = [
        'nguoi_dung_id',
        'ngay_tao',
        'thanh_tien',
        'tong_tien',
        'so_tien_giam',
        'trang_thai',
        'ghi_chu',
        'ten_nguoi_nhan',
        'sdt_nguoi_nhan',
        'dia_chi_giao_hang',
        'so_luong_sach',
        'phuong_thuc_thanh_toan'
    ];

    public $timestamps = false;
    protected $dates = ['ngay_tao'];

    public function nguoidung()
    {
        return $this->belongsTo(nguoidung::class, 'nguoi_dung_id');
    }

    public function chitietdonhangs()
    {
        return $this->hasMany(Chitietdonhang::class, 'don_hang_id');
    }

    public function thanhtoans()
    {
        return $this->hasMany(Thanhtoan::class, 'don_hang_id');
    }
}