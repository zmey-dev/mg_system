<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('doctotipo', function (Blueprint $table) {
            $table->id('doctotipo_id');
            $table->string('doctotipo_nome', 100);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('doctotipo');
    }
};
