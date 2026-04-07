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
        Schema::create('thanhtoan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('don_hang_id')
            ->constrained('donhang');
            $table->string('phuong_thuc')->nullable();
            $table->decimal('so_tien',10,2)->nullable();
            $table->string('trang_thai')->nullable();
            $table->timestamp('ngay_thanh_toan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('thanhtoan');
    }
};
