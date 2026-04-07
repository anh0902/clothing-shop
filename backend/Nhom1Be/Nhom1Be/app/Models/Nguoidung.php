<?php

namespace App\Models;

Use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
class Nguoidung extends Authenticatable
{
    use HasApiTokens;
    protected $table = 'nguoidung';
    protected $fillable = [
        'ten_dang_nhap',
        'mat_khau',
        'google_id',
        'email',
        'so_dien_thoai',
        'dia_chi',
        'provider',
        'role',
        'ngay_tao'
    ];

    protected $hidden = [
        'mat_khau'
    ];

    public function getAuthPassword()
    {
        return $this->mat_khau;
    }
    public $timestamps = false;

    // Relationships
    public function donhangs()
    {
        return $this->hasMany(Donhang::class, 'nguoi_dung_id');
    }

    public function giohangs()
    {
        return $this->hasMany(Giohang::class, 'nguoi_dung_id');
    }
}
