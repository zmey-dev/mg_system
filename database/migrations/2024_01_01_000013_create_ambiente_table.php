<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ambiente', function (Blueprint $table) {
            $table->id('ambiente_id');
            $table->foreignId('torre_id')->constrained('torre', 'torre_id')->onDelete('cascade');
            $table->string('ambiente_nome', 100);
            $table->text('ambiente_descricao')->nullable();
            $table->string('ambiente_imagem', 255)->nullable();
            $table->timestamps();

            $table->index('torre_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ambiente');
    }
};
