<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('item', function (Blueprint $table) {
            $table->id('item_id');
            $table->foreignId('ambiente_id')->constrained('ambiente', 'ambiente_id')->onDelete('cascade');
            $table->foreignId('itemsubgrupo_id')->constrained('itemsubgrupo', 'itemsubgrupo_id');
            $table->string('item_nome', 255);
            $table->string('item_marcamodelo', 255)->nullable();
            $table->text('item_descricao')->nullable();
            $table->text('item_complemento')->nullable();
            $table->string('item_imagem', 255)->nullable();
            $table->string('item_qrcode', 255)->nullable();
            $table->string('item_status', 20)->default('ativo');
            $table->timestamps();

            $table->index('ambiente_id');
            $table->index('itemsubgrupo_id');
            $table->index('item_status');
        });

        // Add CHECK constraint for PostgreSQL enum-like behavior
        if (config('database.default') === 'pgsql') {
            DB::statement("ALTER TABLE item ADD CONSTRAINT item_status_check CHECK (item_status IN ('ativo', 'inativo'))");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('item');
    }
};
