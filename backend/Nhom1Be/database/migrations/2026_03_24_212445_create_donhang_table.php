<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donhang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('nguoi_dung_id')
            ->constrained('nguoidung');
            $table->timestamp('ngay_tao')->useCurrent();
            $table->decimal('thanh_tien',10,2)->nullable();
            $table->decimal('tong_tien',10,2)->nullable();
            $table->decimal('so_tien_giam',10,2)->nullable();
            $table->string('trang_thai')->nullable();
            $table->text('ghi_chu')->nullable();
            $table->string('ten_nguoi_nhan')->nullable();
            $table->string('sdt_nguoi_nhan')->nullable();
            $table->string('dia_chi_giao_hang')->nullable();
            $table->integer('so_luong_sach')->nullable();
            $table->string('phuong_thuc_thanh_toan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donhang');
    }
};
