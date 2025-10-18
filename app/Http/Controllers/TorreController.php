<?php

namespace App\Http\Controllers;

use App\Models\Torre;
use App\Models\Empreendimento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TorreController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;

        $query = Torre::with('empreendimento');

        if ($empreendimentoId) {
            $query->where('empreendimento_id', $empreendimentoId);
        }

        $torres = $query->paginate(20);

        $empreendimentos = Empreendimento::select('empreendimento_id', 'empreendimento_nome')
            ->when($empreendimentoId, function ($q) use ($empreendimentoId) {
                return $q->where('empreendimento_id', $empreendimentoId);
            })
            ->get();

        return Inertia::render('Torres', [
            'torres' => $torres,
            'empreendimentos' => $empreendimentos,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'empreendimento_id' => 'required|exists:empreendimento,empreendimento_id',
            'torre_nome' => 'required|string|max:100',
            'torre_qtdaptos' => 'nullable|integer|min:1',
        ]);

        // Non-master users can only create torres for their own empreendimento
        if ($user->role !== 'master' && $user->empreendimento_id != $validated['empreendimento_id']) {
            return back()->withErrors(['empreendimento_id' => 'Você só pode criar torres para seu próprio empreendimento.']);
        }

        Torre::create($validated);

        return redirect()->route('catalog')->with('success', 'Torre criada com sucesso.');
    }

    public function show($id)
    {
        $torre = Torre::with(['empreendimento', 'ambientes.items'])->findOrFail($id);

        return response()->json($torre);
    }

    public function update(Request $request, $id)
    {
        $torre = Torre::findOrFail($id);

        $validated = $request->validate([
            'torre_nome' => 'sometimes|string|max:100',
            'torre_qtdaptos' => 'nullable|integer|min:1',
        ]);

        $torre->update($validated);

        return redirect()->route('catalog')->with('success', 'Torre atualizada com sucesso.');
    }

    public function destroy($id)
    {
        $torre = Torre::findOrFail($id);
        $torre->delete();

        return redirect()->route('catalog')->with('success', 'Torre excluída com sucesso.');
    }
}
