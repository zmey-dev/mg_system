<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        DB::table('users')->updateOrInsert(
            ['email' => 'master@example.com'],
            [
                'name' => 'Master User',
                'email' => 'master@example.com',
                'password' => Hash::make('password'),
                'role' => 'master',
                'empreendimento_id' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // ItemGrupo
        DB::table('itemgrupo')->insert([
            ['itemgrupo_nome' => 'ar', 'itemgrupo_descricao' => 'Air Systems', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'água', 'itemgrupo_descricao' => 'Water Systems', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'eletrodomésticos, eletrônicos', 'itemgrupo_descricao' => 'Appliances, Electronics', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'equipamento', 'itemgrupo_descricao' => 'Equipment', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'infra (estrutural)', 'itemgrupo_descricao' => 'Infrastructure', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'segurança', 'itemgrupo_descricao' => 'Security', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'esquadrias', 'itemgrupo_descricao' => 'Frames', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'acabamentos', 'itemgrupo_descricao' => 'Finishes', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'elétrica', 'itemgrupo_descricao' => 'Electrical', 'itemgrupo_bloqueado' => false],
            ['itemgrupo_nome' => 'lazer', 'itemgrupo_descricao' => 'Leisure', 'itemgrupo_bloqueado' => false],
        ]);

        // Origem
        DB::table('origem')->insert([
            ['origem_nome' => 'Padrão'],
            ['origem_nome' => 'Adicionada'],
            ['origem_nome' => 'Bloqueada'],
        ]);

        // Tipo
        DB::table('tipo')->insert([
            ['tipo_nome' => 'Preventiva'],
            ['tipo_nome' => 'Obrigatória'],
            ['tipo_nome' => 'Corriqueira'],
        ]);

        // DoctoTipo
        DB::table('doctotipo')->insert([
            ['doctotipo_nome' => 'contrato'],
            ['doctotipo_nome' => 'fixo'],
            ['doctotipo_nome' => 'NFe'],
            ['doctotipo_nome' => 'ART'],
            ['doctotipo_nome' => 'sem dcto'],
            ['doctotipo_nome' => 'outros'],
        ]);

        // Periodo
        DB::table('periodo')->insert([
            ['periodo_nome' => 'diária', 'periodo_dias' => 1],
            ['periodo_nome' => 'mensal', 'periodo_dias' => 30],
            ['periodo_nome' => 'semestral', 'periodo_dias' => 180],
            ['periodo_nome' => 'anual', 'periodo_dias' => 365],
        ]);

        // Profissional
        DB::table('profissional')->insert([
            ['profissional_tipo' => 'manutensista', 'profissional_descricao' => 'General maintenance worker'],
            ['profissional_tipo' => 'engenheiro eletricista', 'profissional_descricao' => 'Electrical engineer'],
            ['profissional_tipo' => 'engenheiro hidráulico', 'profissional_descricao' => 'Hydraulic engineer'],
            ['profissional_tipo' => 'específico', 'profissional_descricao' => 'Specific (maintenance contract)'],
            ['profissional_tipo' => 'implantação', 'profissional_descricao' => 'Implementation (builder/developer)'],
        ]);
    }
}
