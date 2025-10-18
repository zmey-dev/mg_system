<?php

namespace Database\Seeders;

use App\Models\Origem;
use App\Models\Tipo;
use App\Models\DoctoTipo;
use App\Models\Periodo;
use App\Models\Profissional;
use Illuminate\Database\Seeder;

class ParameterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Origens (Origem das solicitações)
        $origens = [
            ['origem_nome' => 'Morador'],
            ['origem_nome' => 'Síndico'],
            ['origem_nome' => 'Vistoria'],
            ['origem_nome' => 'Preventiva'],
            ['origem_nome' => 'Emergência'],
        ];

        foreach ($origens as $origem) {
            Origem::create($origem);
        }

        // Tipos de Atividades
        $tipos = [
            ['tipo_nome' => 'Preventiva'],
            ['tipo_nome' => 'Corretiva'],
            ['tipo_nome' => 'Emergencial'],
            ['tipo_nome' => 'Inspeção'],
            ['tipo_nome' => 'Instalação'],
        ];

        foreach ($tipos as $tipo) {
            Tipo::create($tipo);
        }

        // Tipos de Documentos
        $doctoTipos = [
            ['doctotipo_nome' => 'ART'],
            ['doctotipo_nome' => 'Laudo Técnico'],
            ['doctotipo_nome' => 'Nota Fiscal'],
            ['doctotipo_nome' => 'Certificado'],
            ['doctotipo_nome' => 'Relatório'],
            ['doctotipo_nome' => 'Garantia'],
            ['doctotipo_nome' => 'Manual'],
        ];

        foreach ($doctoTipos as $doctoTipo) {
            DoctoTipo::create($doctoTipo);
        }

        // Períodos de Execução
        $periodos = [
            ['periodo_nome' => 'Diário', 'periodo_dias' => 1],
            ['periodo_nome' => 'Semanal', 'periodo_dias' => 7],
            ['periodo_nome' => 'Quinzenal', 'periodo_dias' => 15],
            ['periodo_nome' => 'Mensal', 'periodo_dias' => 30],
            ['periodo_nome' => 'Bimestral', 'periodo_dias' => 60],
            ['periodo_nome' => 'Trimestral', 'periodo_dias' => 90],
            ['periodo_nome' => 'Semestral', 'periodo_dias' => 180],
            ['periodo_nome' => 'Anual', 'periodo_dias' => 365],
            ['periodo_nome' => 'Sob Demanda', 'periodo_dias' => 0],
        ];

        foreach ($periodos as $periodo) {
            Periodo::create($periodo);
        }

        // Profissionais
        $profissionais = [
            ['profissional_tipo' => 'Eletricista'],
            ['profissional_tipo' => 'Encanador'],
            ['profissional_tipo' => 'Jardineiro'],
            ['profissional_tipo' => 'Técnico de Piscina'],
            ['profissional_tipo' => 'Técnico de Ar-Condicionado'],
            ['profissional_tipo' => 'Pintor'],
            ['profissional_tipo' => 'Pedreiro'],
            ['profissional_tipo' => 'Serralheiro'],
            ['profissional_tipo' => 'Vidraceiro'],
            ['profissional_tipo' => 'Marceneiro'],
            ['profissional_tipo' => 'Técnico de Elevadores'],
            ['profissional_tipo' => 'Dedetizador'],
            ['profissional_tipo' => 'Zelador'],
            ['profissional_tipo' => 'Bombeiro Hidráulico'],
            ['profissional_tipo' => 'Técnico de Aquecimento'],
        ];

        foreach ($profissionais as $profissional) {
            Profissional::create($profissional);
        }
    }
}
