<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmpreendimentoSeeder extends Seeder
{
    public function run(): void
    {
        $empreendimentos = [
            [
                'empreendimento_nome' => 'Condomínio Exemplo 1',
                'empreendimento_endereco' => 'Rua das Flores, 123',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'empreendimento_nome' => 'Condomínio Exemplo 2',
                'empreendimento_endereco' => 'Av. Principal, 456',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($empreendimentos as $empreendimento) {
            DB::table('empreendimento')->insertOrIgnore($empreendimento);
        }
    }
}
