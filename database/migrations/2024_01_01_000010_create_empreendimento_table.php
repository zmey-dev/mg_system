<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('empreendimento', function (Blueprint $table) {
            $table->id('empreendimento_id');
            $table->string('empreendimento_nome', 255);
            $table->string('empreendimento_cnpj', 20);
            $table->string('empreendimento_endereco', 255);
            $table->string('empreendimento_numero', 10);
            $table->string('empreendimento_cep', 10);
            $table->string('empreendimento_cidade', 100);
            $table->string('empreendimento_uf', 2);
            $table->integer('empreendimento_qtdtorre')->nullable();
            $table->enum('empreendimento_status', ['ativo', 'bloqueado'])->default('ativo');
            $table->timestamps();

            $table->index('empreendimento_status');
            $table->index('empreendimento_cnpj');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('empreendimento');
    }
};
