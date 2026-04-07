<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NguoidungController;
use App\Http\Controllers\SachController;
use App\Http\Controllers\DonhangController;
use App\Http\Controllers\GiohangController;
use App\Http\Controllers\ChitietgiohangController;
use App\Http\Controllers\LoaisachController;

Route::post('/login',[NguoidungController::class,'login']);
Route::post('/register',[NguoidungController::class,'acpregister']);
Route::get('/sach/filter', [SachController::class, 'filter']);
Route::get('/sach', [SachController::class, 'index']);
Route::get('/sach/{id}', [SachController::class, 'show']);
Route::post('/sach/add', [SachController::class, 'store']);

Route::get('/loaisach', [LoaisachController::class, 'index']);
Route::get('/loaisach/{id}', [LoaisachController::class, 'show']);

Route::get('/category', [LoaisachController::class, 'index']);
Route::get('/category/{id}', [LoaisachController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    // người dùng
    Route::get('/nguoidung', [NguoidungController::class, 'index']);
    Route::get('/nguoidung/{id}', [NguoidungController::class, 'show']);
    Route::put('/nguoidung/{id}', [NguoidungController::class, 'update']);

    // giỏ hàng
    Route::get('/giohang', [GiohangController::class, 'index']);
    Route::delete('/giohang/{id}', [GiohangController::class, 'destroy']);

    // đơn hàng
    Route::apiResource('donhang', DonhangController::class);
    Route::post('/checkout', [DonhangController::class, 'checkout']);

    // chi tiết giỏ hàng
    Route::post('/chitietgiohang/them', [ChitietgiohangController::class, 'themVaoGio']);
    Route::put('/chitietgiohang/{sach_id}', [ChitietgiohangController::class, 'capNhatSoLuong']);
    Route::delete('/chitietgiohang/{sach_id}', [ChitietgiohangController::class, 'xoaChiTiet']);
});




