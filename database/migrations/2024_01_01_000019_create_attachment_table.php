<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachment', function (Blueprint $table) {
            $table->id('attachment_id');
            $table->foreignId('atividaderegistro_id')->constrained('atividaderegistro', 'atividaderegistro_id')->onDelete('cascade');
            $table->string('attachment_nome', 255);
            $table->string('attachment_caminho', 500);
            $table->string('attachment_tipo', 50);
            $table->integer('attachment_tamanho')->nullable();
            $table->timestamps();

            $table->index('atividaderegistro_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachment');
    }
};
