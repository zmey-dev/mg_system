<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('origem', function (Blueprint $table) {
            $table->text('origem_descricao')->nullable()->after('origem_nome');
        });

        Schema::table('tipo', function (Blueprint $table) {
            $table->text('tipo_descricao')->nullable()->after('tipo_nome');
        });

        Schema::table('doctotipo', function (Blueprint $table) {
            $table->text('doctotipo_descricao')->nullable()->after('doctotipo_nome');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('origem', function (Blueprint $table) {
            $table->dropColumn('origem_descricao');
        });

        Schema::table('tipo', function (Blueprint $table) {
            $table->dropColumn('tipo_descricao');
        });

        Schema::table('doctotipo', function (Blueprint $table) {
            $table->dropColumn('doctotipo_descricao');
        });
    }
};
