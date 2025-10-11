<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('itemgrupo', function (Blueprint $table) {
            $table->id('itemgrupo_id');
            $table->string('itemgrupo_nome', 100);
            $table->text('itemgrupo_descricao')->nullable();
            $table->boolean('itemgrupo_bloqueado')->default(false);
            $table->timestamps();

            $table->index('itemgrupo_bloqueado');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('itemgrupo');
    }
};
