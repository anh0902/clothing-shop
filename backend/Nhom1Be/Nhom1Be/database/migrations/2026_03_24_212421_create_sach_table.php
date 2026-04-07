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
        Schema::create('sach', function (Blueprint $table) {
            $table->id();
            $table->string('ten_sach')->nullable();
            $table->string('tac_gia')->nullable();
            $table->string('nha_xuat_ban')->nullable();
            $table->decimal('gia',10,2)->nullable();
            $table->integer('so_luong')->nullable();
            $table->integer('trong_luong')->nullable();
            $table->string('kich_thuoc')->nullable();
            $table->integer('so_trang')->nullable();
            $table->text('mo_ta')->nullable();
            $table->text('anh_bia')->nullable();
            $table->boolean('trang_thai')->nullable();
            $table->foreignId('loai_sach_id')
            ->constrained('loaisach');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sach');
    }
};
