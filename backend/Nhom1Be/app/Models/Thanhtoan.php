<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Thanhtoan extends Model
{
    protected $table = 'thanhtoan';
    protected $fillable = [
        'don_hang_id',
        'phuong_thuc',
        'so_tien',
        'trang_thai',
        'ngay_thanh_toan'
    ];

    public $timestamps = false;
    protected $dates = ['ngay_thanh_toan'];

    // Relationships
    public function donhang()
    {
        return $this->belongsTo(Donhang::class, 'don_hang_id');
    }
}