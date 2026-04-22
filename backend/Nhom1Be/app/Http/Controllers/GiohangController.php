<?php

namespace App\Http\Controllers;
use App\Models\Giohang;
use Illuminate\Http\Request;

class GiohangController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $giohang = Giohang::firstOrCreate(
                            ['nguoi_dung_id' => $userId]
                        );
        
        $giohang->load('chitietgiohangs.sach');
        
        $tongTienThanhToan = 0;
        if ($giohang->chitietgiohangs) {
            foreach ($giohang->chitietgiohangs as $item) {
                $tongTienThanhToan += $item->thanh_tien;
            }
        }

        return response()->json([
            'success' => true,
            'data' => [
                'thong_tin_gio_hang'   => $giohang,
                'tong_tien_thanh_toan' => $tongTienThanhToan
            ]
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nguoi_dung_id' => 'required|exists:nguoidung,id|unique:giohang,nguoi_dung_id'
        ]);

        $giohang = Giohang::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Đã tạo giỏ hàng',
            'data' => $giohang
        ], 201);
    }
    public function destroy(Request $request, $id)
    {
    $giohang = Giohang::findOrFail($id);

        if ($giohang->nguoi_dung_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xóa giỏ hàng này'
            ], 403);
        }
        $giohang->delete();
        return response()->json([
            'success' => true,
            'message' => 'Đã xóa giỏ hàng thành công'
        ]);
    }
}
