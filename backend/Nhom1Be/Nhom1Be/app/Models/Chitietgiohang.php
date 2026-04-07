<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chitietgiohang extends Model
{ 
    public $incrementing = false;

    protected $table = 'chitietgiohang';
    protected $fillable = [
        'gio_hang_id',
        'sach_id',
        'so_luong',
        'don_gia',
        'thanh_tien'
    ];

    protected $primaryKey = null;

    public $timestamps = false;

    public function giohang()
    {
        return $this->belongsTo(Giohang::class, 'gio_hang_id');
    }

    public function sach()
    {
        return $this->belongsTo(Sach::class, 'sach_id');
    }
}
