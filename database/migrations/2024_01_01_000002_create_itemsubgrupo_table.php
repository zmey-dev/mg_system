<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itemsubgrupo', function (Blueprint $table) {
            $table->id('itemsubgrupo_id');
            $table->foreignId('itemgrupo_id')->constrained('itemgrupo', 'itemgrupo_id')->onDelete('cascade');
            $table->string('itemsubgrupo_nome');
            $table->text('itemsubgrupo_descricao')->nullable();
            $table->boolean('itemsubgrupo_bloqueado')->default(false);
            $table->timestamps();

            $table->index('itemgrupo_id');
            $table->index('itemsubgrupo_bloqueado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itemsubgrupo');
    }
};
