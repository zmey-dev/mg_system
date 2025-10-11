<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
use App\Models\AtividadeRegistro;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AtividadeRegistroController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;

        $registros = AtividadeRegistro::with([
            'atividade.item.ambiente.torre',
            'usuario',
            'attachments'
        ])
            ->whereHas('atividade.item.ambiente.torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
            })
            ->orderBy('atividaderegistro_dtinicio', 'desc')
            ->paginate(20);

        return Inertia::render('Registros', [
            'registros' => $registros,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'atividade_id' => 'required|exists:atividade,atividade_id',
            'atividaderegistro_dtinicio' => 'required|date',
            'atividaderegistro_observacoes' => 'nullable|string',
        ]);

        $validated['usuario_id'] = $request->user()->id;
        $validated['status'] = 'em_andamento';

        $registro = AtividadeRegistro::create($validated);

        $atividade = Atividade::find($validated['atividade_id']);
        $atividade->update(['atividade_status' => 'ativa']);

        return redirect()->route('registros.index')->with('success', 'Registro started successfully.');
    }

    public function show(Request $request, $id)
    {
        $registro = AtividadeRegistro::with([
            'atividade.item.ambiente.torre',
            'atividade.periodo',
            'usuario',
            'attachments'
        ])->findOrFail($id);

        return response()->json($registro);
    }

    public function update(Request $request, $id)
    {
        $registro = AtividadeRegistro::findOrFail($id);

        $validated = $request->validate([
            'atividaderegistro_observacoes' => 'nullable|string',
            'costs_json' => 'nullable|array',
        ]);

        $registro->update($validated);

        return redirect()->route('registros.index')->with('success', 'Registro updated successfully.');
    }

    public function complete(Request $request, $id)
    {
        $registro = AtividadeRegistro::with('atividade.periodo')->findOrFail($id);

        $validated = $request->validate([
            'atividaderegistro_dtrealizada' => 'required|date',
            'atividaderegistro_observacoes' => 'nullable|string',
            'costs_json' => 'nullable|array',
        ]);

        $validated['status'] = 'concluida';

        $dtRealizada = Carbon::parse($validated['atividaderegistro_dtrealizada']);
        $periodoDias = $registro->atividade->periodo->periodo_dias ?? 0;

        if ($periodoDias > 0) {
            $validated['atividaderegistro_dtproxima'] = $dtRealizada->copy()->addDays($periodoDias);
        }

        $registro->update($validated);

        $atividade = $registro->atividade;
        if ($validated['atividaderegistro_dtproxima']) {
            $atividade->update([
                'atividade_dtestimada' => $validated['atividaderegistro_dtproxima']
            ]);
        }

        return redirect()->route('registros.index')->with('success', 'Registro completed successfully.');
    }
}
