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
        Schema::create('chitietdonhang', function (Blueprint $table) {
            $table->foreignId('don_hang_id');
            $table->foreignId('sach_id');
            $table->integer('so_luong')->nullable();
            $table->decimal('don_gia',10,2)->nullable();
            $table->decimal('thanh_tien',10,2)->nullable();
            $table->primary(['don_hang_id','sach_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chitietdonhang');
    }
};
