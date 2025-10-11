<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('periodo', function (Blueprint $table) {
            $table->id('periodo_id');
            $table->string('periodo_nome', 50);
            $table->integer('periodo_dias')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('periodo');
    }
};
