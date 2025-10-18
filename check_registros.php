<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\AtividadeRegistro;

echo "Checking AtividadeRegistro records...\n\n";

$registros = AtividadeRegistro::with(['atividade', 'usuario'])
    ->orderBy('created_at', 'desc')
    ->limit(10)
    ->get();

if ($registros->isEmpty()) {
    echo "No registros found in database.\n";
} else {
    echo "Found " . $registros->count() . " registros:\n\n";
    foreach ($registros as $reg) {
        echo "ID: {$reg->atividaderegistro_id}\n";
        echo "Atividade ID: {$reg->atividade_id}\n";
        echo "Usuario ID: {$reg->usuario_id}\n";
        echo "Status: {$reg->status}\n";
        echo "Inicio: {$reg->atividaderegistro_dtinicio}\n";
        echo "Created: {$reg->created_at}\n";
        echo "---\n";
    }
}
