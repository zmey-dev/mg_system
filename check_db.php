<?php
require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== USERS ===\n";
$users = App\Models\User::all(['id', 'name', 'email', 'role', 'empreendimento_id']);
foreach($users as $u) {
    echo sprintf("ID: %d | Name: %s | Email: %s | Role: %s | Empreendimento: %s\n",
        $u->id, $u->name, $u->email, $u->role, $u->empreendimento_id ?? 'NULL');
}

echo "\n=== EMPREENDIMENTOS ===\n";
$emps = App\Models\Empreendimento::all(['empreendimento_id', 'empreendimento_nome']);
foreach($emps as $e) {
    echo sprintf("ID: %d | Nome: %s\n", $e->empreendimento_id, $e->empreendimento_nome);
}

echo "\n=== PARAMETER TABLES ===\n";
echo "Tipos: " . App\Models\Tipo::count() . "\n";
echo "Profissionais: " . App\Models\Profissional::count() . "\n";
echo "ItemGrupos: " . App\Models\ItemGrupo::count() . "\n";
echo "ItemSubgrupos: " . App\Models\ItemSubgrupo::count() . "\n";
