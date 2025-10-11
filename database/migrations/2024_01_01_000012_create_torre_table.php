<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('torre', function (Blueprint $table) {
            $table->id('torre_id');
            $table->foreignId('empreendimento_id')->constrained('empreendimento', 'empreendimento_id')->onDelete('cascade');
            $table->string('torre_nome', 100);
            $table->integer('torre_qtdaptos')->nullable();
            $table->timestamps();

            $table->index('empreendimento_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('torre');
    }
};
