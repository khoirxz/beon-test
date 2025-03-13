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
        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('description', 200)->notNull();
            $table->date('expense_date')->notNull();
            $table->integer('expense_total')->notNull();
            $table->uuid('id_admin')->notNull();
            $table->uuid('id_services')->notNull();
            $table->timestamps();
            
            $table->foreign('id_admin')->references('id')->on('users');
            $table->foreign('id_services')->references('id')->on('services');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
