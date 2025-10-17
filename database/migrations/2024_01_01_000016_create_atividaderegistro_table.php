<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('atividaderegistro', function (Blueprint $table) {
            $table->id('atividaderegistro_id');
            $table->foreignId('atividade_id')->constrained('atividade', 'atividade_id')->onDelete('cascade');
            $table->foreignId('usuario_id')->constrained('users', 'id');
            $table->dateTime('atividaderegistro_dtinicio');
            $table->dateTime('atividaderegistro_dtrealizada')->nullable();
            $table->string('atividaderegistro_dcto', 255)->nullable();
            $table->string('atividaderegistro_anexo', 255)->nullable();
            $table->text('atividaderegistro_observacoes')->nullable();
            $table->date('atividaderegistro_dtproxima')->nullable();
            $table->json('costs_json')->nullable();
            $table->foreignId('performed_by')->nullable()->constrained('users', 'id');
            $table->string('status', 20)->default('em_andamento');
            $table->timestamps();

            $table->index('atividade_id');
            $table->index('usuario_id');
            $table->index('performed_by');
            $table->index('status');
            $table->index('atividaderegistro_dtrealizada');
            $table->index('atividaderegistro_dtproxima');
        });

        // Add CHECK constraint for PostgreSQL enum-like behavior
        if (config('database.default') === 'pgsql') {
            DB::statement("ALTER TABLE atividaderegistro ADD CONSTRAINT atividaderegistro_status_check CHECK (status IN ('em_andamento', 'concluida'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('atividaderegistro');
    }
};
