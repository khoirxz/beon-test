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
        Schema::create('residents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->char('name', 100)->notNullable();
            $table->text('photo_id')->nullable();
            $table->enum('resident_status', ['permanent', 'contract'])->default('permanent');
            $table->char('phone', 50)->notNull();
            $table->boolean('married_status')->notNull();
            // soft delete
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residents');
    }
};
