<?php

namespace Database\Seeders;

use App\Models\ItemGrupo;
use App\Models\ItemSubgrupo;
use Illuminate\Database\Seeder;

class ItemSubgrupoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get grupo IDs
        $jardinagem = ItemGrupo::where('itemgrupo_nome', 'Equipamentos de Jardinagem e Paisagismo')->first();
        $piscinas = ItemGrupo::where('itemgrupo_nome', 'Piscinas, Áreas de Lazer e Bem-estar')->first();
        $climatizacao = ItemGrupo::where('itemgrupo_nome', 'Sistemas de Aquecimento e Refrigeração')->first();

        $subgrupos = [
            // Equipamentos de Jardinagem e Paisagismo
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Soprador (leaf blower)',
                'itemsubgrupo_descricao' => 'Equipamento para soprar folhas e detritos'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Roçadeira',
                'itemsubgrupo_descricao' => 'Equipamento para cortar grama e vegetação'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Cortador de grama (ride-on)',
                'itemsubgrupo_descricao' => 'Cortador de grama montável'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Cortador de grama (manual)',
                'itemsubgrupo_descricao' => 'Cortador de grama manual ou autopropelido'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Aparador de cerca viva',
                'itemsubgrupo_descricao' => 'Equipamento para aparar cercas vivas'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Motobomba para jardim',
                'itemsubgrupo_descricao' => 'Bomba para irrigação de jardins'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Cortador elétrico de bordas',
                'itemsubgrupo_descricao' => 'Equipamento para cortar bordas de grama'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Trator de jardim (mini)',
                'itemsubgrupo_descricao' => 'Trator compacto para jardinagem'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Triturador de galhos',
                'itemsubgrupo_descricao' => 'Equipamento para triturar galhos e resíduos'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Soprador industrial',
                'itemsubgrupo_descricao' => 'Soprador de alta potência'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Sistema de nebulização (jardim)',
                'itemsubgrupo_descricao' => 'Sistema de irrigação por nebulização'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Sistema de irrigação de jardim',
                'itemsubgrupo_descricao' => 'Sistema automatizado de irrigação'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Árvores de grande porte - inspeção semestral',
                'itemsubgrupo_descricao' => 'Serviço de inspeção de árvores'
            ],
            [
                'itemgrupo_id' => $jardinagem->itemgrupo_id,
                'itemsubgrupo_nome' => 'Bomba de piscina',
                'itemsubgrupo_descricao' => 'Bomba para circulação de água'
            ],

            // Piscinas, Áreas de Lazer e Bem-estar
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Filtro de piscina (areiaDE)',
                'itemsubgrupo_descricao' => 'Sistema de filtragem de piscina'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Aquecedor de piscina',
                'itemsubgrupo_descricao' => 'Sistema de aquecimento de água'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Clorador automático',
                'itemsubgrupo_descricao' => 'Sistema automático de cloração'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Dosador de produtos químicos',
                'itemsubgrupo_descricao' => 'Dosador automático de produtos químicos'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Skimmer e calha',
                'itemsubgrupo_descricao' => 'Sistema de limpeza superficial'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Troca de areia do filtro',
                'itemsubgrupo_descricao' => 'Serviço de manutenção de filtro'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Spa/Jacuzzi (bomba e aquecedor)',
                'itemsubgrupo_descricao' => 'Sistema de spa ou jacuzzi'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Piscina infantil - brinquedos e filtros',
                'itemsubgrupo_descricao' => 'Equipamentos para piscina infantil'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Sauna (gerador / aquecimento)',
                'itemsubgrupo_descricao' => 'Sistema de geração de vapor para sauna'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Quadra de esportes - piso e iluminação',
                'itemsubgrupo_descricao' => 'Piso e iluminação de quadras esportivas'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Iluminação da quadra',
                'itemsubgrupo_descricao' => 'Sistema de iluminação para quadras'
            ],
            [
                'itemgrupo_id' => $piscinas->itemgrupo_id,
                'itemsubgrupo_nome' => 'Bola de chopp (tap)',
                'itemsubgrupo_descricao' => 'Sistema de chopp para área de lazer'
            ],

            // Sistemas de Aquecimento e Refrigeração
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Sistema de aquecimento (boiler)',
                'itemsubgrupo_descricao' => 'Boiler e sistema de aquecimento de água'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Caldeira (quando houver)',
                'itemsubgrupo_descricao' => 'Sistema de caldeira para aquecimento'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Sistema de aquecimento de água (a gás)',
                'itemsubgrupo_descricao' => 'Aquecedor de passagem a gás'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Boiler elétrico',
                'itemsubgrupo_descricao' => 'Boiler elétrico para aquecimento de água'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Ar-condicionado split (áreas comuns)',
                'itemsubgrupo_descricao' => 'Sistema de ar-condicionado split'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Ar-condicionado central (AHU)',
                'itemsubgrupo_descricao' => 'Sistema de ar-condicionado central'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Ventiladores de exaustão',
                'itemsubgrupo_descricao' => 'Sistema de ventilação e exaustão'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Chiller (quando houver)',
                'itemsubgrupo_descricao' => 'Sistema chiller para refrigeração'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Bomba de circulação (HVAC)',
                'itemsubgrupo_descricao' => 'Bomba de circulação para sistema HVAC'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Trocador de calor',
                'itemsubgrupo_descricao' => 'Equipamento de troca de calor'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Painel solar (módulos)',
                'itemsubgrupo_descricao' => 'Painéis solares para aquecimento'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Inversor solar (inversores)',
                'itemsubgrupo_descricao' => 'Inversores para sistema solar'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Controlador de carga (solar)',
                'itemsubgrupo_descricao' => 'Controlador de carga para sistema solar'
            ],
            [
                'itemgrupo_id' => $climatizacao->itemgrupo_id,
                'itemsubgrupo_nome' => 'Sistema de monitoramento de energia',
                'itemsubgrupo_descricao' => 'Sistema de monitoramento de consumo de energia'
            ],
        ];

        foreach ($subgrupos as $subgrupo) {
            ItemSubgrupo::create($subgrupo);
        }
    }
}
