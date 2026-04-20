<?php

namespace App\Http\Controllers;
use App\Models\Chitietgiohang;
use App\Models\Giohang;
use App\Models\Sach;
use Illuminate\Http\Request;

class ChitietgiohangController extends Controller
{
    public function themVaoGio(Request $request)
    {
        $request->validate([
            'sach_id'  => 'required|exists:sach,id',
            'so_luong' => 'required|integer|min:1'
        ]);
        $userId = $request->user()->id;
        $sachId = $request->sach_id;
        $soLuongThem = $request->so_luong;
        $sach = Sach::findOrFail($sachId);
        $giohang = Giohang::firstOrCreate(['nguoi_dung_id' => $userId]);
        $chiTiet = Chitietgiohang::where('gio_hang_id', $giohang->id)
                                ->where('sach_id', $sachId)
                                ->first();

        if ($chiTiet) {
            $soLuongMoi = $chiTiet->so_luong + $soLuongThem;
            if ($soLuongMoi > $sach->so_luong) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng vượt quá hàng tồn kho! (Chỉ còn ' . $sach->so_luong . ' cuốn)'
                ], 400);
            }
            $chiTiet->update([
                'so_luong'   => $soLuongMoi,
                'thanh_tien' => $soLuongMoi * $chiTiet->don_gia
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Đã cập nhật số lượng sách trong giỏ!',
                'data'    => $chiTiet
            ]);

        } else {
            if ($soLuongThem > $sach->so_luong) {
                return response()->json([
                    'success' => false,
                    'message' => 'Số lượng yêu cầu vượt quá hàng tồn kho! (Chỉ còn ' . $sach->so_luong . ' cuốn)'
                ], 400);
            }

            $chiTiet = Chitietgiohang::create([
                'gio_hang_id' => $giohang->id,
                'sach_id'     => $sachId,
                'so_luong'    => $soLuongThem,
                'don_gia'     => $sach->gia,
                'thanh_tien'  => $soLuongThem * $sach->gia
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Đã thêm sách mới vào giỏ hàng!',
                'data'    => $chiTiet
            ]);
        }
    }
    public function capNhatSoLuong(Request $request, $sach_id)
    {
        $request->validate([
            'so_luong' => 'required|integer|min:1'
        ]);
        $userId = $request->user()->id;
        $soLuongMoi = $request->so_luong;
        $giohang = Giohang::where('nguoi_dung_id', $userId)->first();
        if (!$giohang) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng'], 404);
        }
        $chiTiet = Chitietgiohang::where('gio_hang_id', $giohang->id)
                                ->where('sach_id', $sach_id)
                                ->first();

        if (!$chiTiet) {
            return response()->json(['success' => false, 'message' => 'Sách này không có trong giỏ hàng'], 404);
        }
        $sach = Sach::findOrFail($sach_id);
        if ($soLuongMoi > $sach->so_luong) {
            return response()->json([
                'success' => false,
                'message' => 'Số lượng vượt quá hàng tồn kho! (Chỉ còn ' . $sach->so_luong . ' cuốn)'
            ], 400);
        }
        $chiTiet->update([
            'so_luong'   => $soLuongMoi,
            'thanh_tien' => $soLuongMoi * $chiTiet->don_gia
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đã cập nhật số lượng',
            'data'    => $chiTiet
        ]);
    }
    public function xoaChiTiet(Request $request, $sach_id)
    {
        $userId = $request->user()->id;

        $giohang = Giohang::where('nguoi_dung_id', $userId)->first();
        if (!$giohang) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy giỏ hàng'], 404);
        }
        $chiTiet = Chitietgiohang::where('gio_hang_id', $giohang->id)
                                ->where('sach_id', $sach_id)
                                ->first();
        if ($chiTiet) {
            $chiTiet->delete();
            return response()->json([
                'success' => true,
                'message' => 'Đã xóa sách khỏi giỏ hàng'
            ]);
        }
        return response()->json(['success' => false, 'message' => 'Sách không tồn tại trong giỏ'], 404);
    }
}
