<?php

namespace App\Http\Controllers;

use App\Models\Ambiente;
use App\Models\Torre;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AmbienteController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;

        $query = Ambiente::with('torre.empreendimento');

        if ($empreendimentoId) {
            $query->whereHas('torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
            });
        }

        $ambientes = $query->paginate(20);

        $torres = Torre::select('torre_id', 'torre_nome', 'empreendimento_id')
            ->when($empreendimentoId, function ($q) use ($empreendimentoId) {
                return $q->where('empreendimento_id', $empreendimentoId);
            })
            ->get();

        return Inertia::render('Ambientes', [
            'ambientes' => $ambientes,
            'torres' => $torres,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'torre_id' => 'required|exists:torre,torre_id',
            'ambiente_nome' => 'required|string|max:100',
            'ambiente_descricao' => 'nullable|string',
        ]);

        Ambiente::create($validated);

        return redirect()->route('catalog')->with('success', 'Ambiente criado com sucesso.');
    }

    public function show($id)
    {
        $ambiente = Ambiente::with(['torre.empreendimento', 'items'])->findOrFail($id);

        return response()->json($ambiente);
    }

    public function update(Request $request, $id)
    {
        $ambiente = Ambiente::findOrFail($id);

        $validated = $request->validate([
            'ambiente_nome' => 'sometimes|string|max:100',
            'ambiente_descricao' => 'sometimes|string',
        ]);

        $ambiente->update($validated);

        return redirect()->route('catalog')->with('success', 'Ambiente atualizado com sucesso.');
    }

    public function destroy($id)
    {
        $ambiente = Ambiente::findOrFail($id);
        $ambiente->delete();

        return redirect()->route('catalog')->with('success', 'Ambiente excluído com sucesso.');
    }
}
