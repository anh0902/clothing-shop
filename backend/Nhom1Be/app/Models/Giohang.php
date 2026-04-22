<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Giohang extends Model
{
    protected $table = 'giohang';
    protected $fillable = [
        'nguoi_dung_id',
        'ngay_tao'
    ];

    public $timestamps = false;
    protected $dates = ['ngay_tao'];

    public function nguoidung()
    {
        return $this->belongsTo(nguoidung::class, 'nguoi_dung_id');
    }

    public function chitietgiohangs()
    {
        return $this->hasMany(Chitietgiohang::class, 'gio_hang_id');
    }
}