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
        Schema::create('chitietphieunhap', function (Blueprint $table) {
            $table->foreignId('phieu_nhap_id');
            $table->foreignId('sach_id');
            $table->integer('so_luong')->nullable();
            $table->decimal('don_gia_du_kien',10,2)->nullable();
            $table->primary(['phieu_nhap_id','sach_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chitietphieunhap');
    }
};
