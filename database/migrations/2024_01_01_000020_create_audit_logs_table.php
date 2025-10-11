<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id('audit_id');
            $table->foreignId('usuario_id')->constrained('users', 'id');
            $table->foreignId('empreendimento_id')->nullable()->constrained('empreendimento', 'empreendimento_id')->onDelete('cascade');
            $table->string('audit_action', 50);
            $table->string('audit_table', 100);
            $table->unsignedBigInteger('audit_record_id')->nullable();
            $table->text('audit_old_values')->nullable();
            $table->text('audit_new_values')->nullable();
            $table->string('audit_ip', 45)->nullable();
            $table->timestamps();

            $table->index('usuario_id');
            $table->index('empreendimento_id');
            $table->index('audit_action');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
