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
        Schema::create('resident_histories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_resident')->notNullable();
            $table->uuid('id_house')->notNullable();
            $table->date('date_filled')->notNullable();
            $table->date('date_out')->nullable();
            $table->softDeletes();
            $table->timestamps();


            // references
            // memberikan referensi ke tabel residents berdasarkan id_resident
            // jika data di tabel residents dihapus maka data di tabel residen_histories juga ikut terhapus
            // $table->foreign('id_resident')->references('id')->on('residents')->onDelete('cascade');
            $table->foreign('id_resident')->references('id')->on('residents'); // <- soft delete pada resident
            // $table->foreign('id_house')->references('id')->on('houses')->onDelete('cascade');
            $table->foreign('id_house')->references('id')->on('houses');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residen_histories');
    }
};
