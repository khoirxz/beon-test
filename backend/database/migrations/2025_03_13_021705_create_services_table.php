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
        Schema::create('services', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name', 100)->notNull();
            $table->string('description', 200)->notNull();
            $table->integer('price')->notNull();
            $table->enum('period', ['weekly', 'monthly', 'annual', 'once'])->notNull();
            $table->enum('type', ['expense', 'income'])->notNull();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
