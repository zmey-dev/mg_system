<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // 1. First seed empreendimentos (needed for users and torres)
            EmpreendimentoSeeder::class,

            // 2. Seed parameters (needed for items)
            ParameterSeeder::class,

            // 3. Seed grupos and subgrupos
            ItemGrupoSeeder::class,
            ItemSubgrupoSeeder::class,

            // 4. Optional: Seed master data if exists
            MasterDataSeeder::class,
        ]);
    }
}
