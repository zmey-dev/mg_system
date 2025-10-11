<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atividade', function (Blueprint $table) {
            $table->id('atividade_id');
            $table->foreignId('item_id')->constrained('item', 'item_id')->onDelete('cascade');
            $table->foreignId('origem_id')->constrained('origem', 'origem_id');
            $table->foreignId('tipo_id')->constrained('tipo', 'tipo_id');
            $table->foreignId('doctotipo_id')->constrained('doctotipo', 'doctotipo_id');
            $table->foreignId('periodo_id')->constrained('periodo', 'periodo_id');
            $table->foreignId('profissional_id')->constrained('profissional', 'profissional_id');
            $table->text('atividade_descricao');
            $table->string('atividade_prioridade', 20)->default('media');
            $table->date('atividade_dtestimada')->nullable();
            $table->string('atividade_status', 20)->default('ativa');
            $table->foreignId('created_by')->constrained('users', 'id');
            $table->timestamps();

            $table->index('item_id');
            $table->index('atividade_status');
            $table->index('atividade_prioridade');
            $table->index('atividade_dtestimada');
        });

        // Add CHECK constraints for PostgreSQL enum-like behavior
        if (config('database.default') === 'pgsql') {
            DB::statement("ALTER TABLE atividade ADD CONSTRAINT atividade_prioridade_check CHECK (atividade_prioridade IN ('alta', 'media', 'baixa'))");
            DB::statement("ALTER TABLE atividade ADD CONSTRAINT atividade_status_check CHECK (atividade_status IN ('ativa', 'bloqueada', 'concluida'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('atividade');
    }
};
