<?php

namespace Database\Seeders;

use App\Models\ItemGrupo;
use Illuminate\Database\Seeder;

class ItemGrupoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $grupos = [
            [
                'itemgrupo_nome' => 'Equipamentos de Jardinagem e Paisagismo',
                'itemgrupo_descricao' => 'Equipamentos e ferramentas para manutenção de jardins e áreas verdes'
            ],
            [
                'itemgrupo_nome' => 'Piscinas, Áreas de Lazer e Bem-estar',
                'itemgrupo_descricao' => 'Equipamentos e sistemas para piscinas e áreas de lazer'
            ],
            [
                'itemgrupo_nome' => 'Sistemas de Aquecimento e Refrigeração',
                'itemgrupo_descricao' => 'Sistemas de climatização, aquecimento e refrigeração'
            ],
        ];

        foreach ($grupos as $grupo) {
            ItemGrupo::create($grupo);
        }
    }
}
