<?php

namespace App\Http\Controllers;

use App\Models\Chitietdonhang;
use App\Models\Donhang;
use App\Models\Giohang;
use App\Models\Sach;
use App\Models\Thanhtoan;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DonhangController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'ho_ten'                 => 'required|string|max:255',
            'so_dien_thoai'          => 'required|string|max:20',
            'dia_chi'                => 'required|string|max:255',
            'phuong_thuc_thanh_toan' => 'required|in:transfer,cod',
            'ghi_chu'                => 'nullable|string'
        ]);

        $userId = $request->user()->id;

        $giohang = Giohang::with('chitietgiohangs.sach')
            ->where('nguoi_dung_id', $userId)
            ->first();

        if (!$giohang || $giohang->chitietgiohangs->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Giỏ hàng của bạn đang trống!'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $tongTien = 0;
            $tongSoLuongSach = 0;

            foreach ($giohang->chitietgiohangs as $item) {
                $giaHienTai = $item->sach->gia_ban ?? $item->don_gia;
                $tongTien += $giaHienTai * $item->so_luong;
                $tongSoLuongSach += $item->so_luong;
            }

            $donhang = Donhang::create([
                'nguoi_dung_id'          => $userId,
                'tong_tien'              => $tongTien,
                'thanh_tien'             => $tongTien,
                'trang_thai'             => 'CHỜ_XÁC_NHẬN',
                'ten_nguoi_nhan'         => $validated['ho_ten'],
                'sdt_nguoi_nhan'         => $validated['so_dien_thoai'],
                'dia_chi_giao_hang'      => $validated['dia_chi'],
                'so_luong_sach'          => $tongSoLuongSach,
                'phuong_thuc_thanh_toan' => strtoupper($validated['phuong_thuc_thanh_toan']),
                'ghi_chu'                => $validated['ghi_chu'] ?? null,
            ]);

            foreach ($giohang->chitietgiohangs as $item) {
                $sach = Sach::lockForUpdate()->find($item->sach_id);
                
                if (!$sach || $sach->so_luong < $item->so_luong) {
                    throw new \Exception("Sách '{$sach->ten_sach}' không đủ số lượng trong kho.");
                }
                $sach->decrement('so_luong', $item->so_luong);
                Chitietdonhang::create([
                    'don_hang_id' => $donhang->id,
                    'sach_id'     => $item->sach_id,
                    'so_luong'    => $item->so_luong,
                    'don_gia'     => $item->sach->gia_ban ?? $item->don_gia,
                    'thanh_tien'  => ($item->sach->gia_ban ?? $item->don_gia) * $item->so_luong
                ]);
            }
            Thanhtoan::create([
                'don_hang_id'     => $donhang->id,
                'phuong_thuc'     => strtoupper($validated['phuong_thuc_thanh_toan']),
                'so_tien'         => $tongTien,
                'trang_thai'      => 'CHUA_THANH_TOAN',
            ]);
            $giohang->chitietgiohangs()->delete();
            DB::commit();
            return response()->json([
                'success' => true,
                'message' => 'Đặt hàng thành công!',
                'don_hang_id' => $donhang->id
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Quá trình đặt hàng thất bại: ' . $e->getMessage()
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $orders = Donhang::where('nguoi_dung_id', $userId)
                         ->orderBy('id', 'desc')
                         ->get();
        return response()->json($orders);
    }

    public function show(Request $request, $id)
    {
        $userId = $request->user()->id;
        $order = Donhang::with(['chitietdonhangs.sach', 'thanhtoans'])
                        ->where('nguoi_dung_id', $userId)
                        ->findOrFail($id);
        return response()->json($order);
    }

    public function destroy(Request $request, $id)
    {
        $userId = $request->user()->id;
        $order = Donhang::where('nguoi_dung_id', $userId)->findOrFail($id);

        if ($order->trang_thai !== 'CHỜ_XÁC_NHẬN') {
            return response()->json([
                'success' => false,
                'message' => 'Không thể hủy đơn hàng ở trạng thái này'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $order->update(['trang_thai' => 'ĐÃ_HỦY']);

            // Hoàn lại số lượng sách
            foreach ($order->chitietdonhangs as $chitiet) {
                $sach = Sach::find($chitiet->sach_id);
                if ($sach) {
                    $sach->increment('so_luong', $chitiet->so_luong);
                }
            }

            // Hủy thanh toán nếu có
            foreach ($order->thanhtoans as $thanhToan) {
                $thanhToan->update(['trang_thai' => 'DA_HUY']);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hủy đơn hàng thành công'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Lỗi khi hủy đơn: ' . $e->getMessage()
            ], 500);
        }
    }
}
