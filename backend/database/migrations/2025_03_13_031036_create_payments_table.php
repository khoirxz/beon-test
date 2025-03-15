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
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_resident_history')->notNull();
            $table->uuid('id_services')->notNull();
            $table->date('payment_date')->notNull();
            $table->integer('total_payment')->notNull();
            $table->enum('status', ['paid', 'unpaid']);
            $table->string('billing_period', 7)->notNull();
            $table->timestamps();

            $table->foreign('id_resident_history')->references('id')->on('resident_histories');
            $table->foreign('id_services')->references('id')->on('services');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
