<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profissional', function (Blueprint $table) {
            $table->id('profissional_id');
            $table->string('profissional_tipo', 100);
            $table->text('profissional_descricao')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profissional');
    }
};
