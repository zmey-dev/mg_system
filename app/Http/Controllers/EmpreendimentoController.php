<?php

namespace App\Http\Controllers;

use App\Models\Empreendimento;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmpreendimentoController extends Controller
{
    public function index(Request $request): Response
    {
        $empreendimentos = Empreendimento::with('torres')->paginate(20);

        return Inertia::render('Empreendimentos', [
            'empreendimentos' => $empreendimentos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'empreendimento_nome' => 'required|string|max:255',
            'empreendimento_cnpj' => 'required|string|max:20',
            'empreendimento_endereco' => 'required|string|max:255',
            'empreendimento_numero' => 'required|string|max:10',
            'empreendimento_cep' => 'required|string|max:10',
            'empreendimento_cidade' => 'required|string|max:100',
            'empreendimento_uf' => 'required|string|size:2',
            'empreendimento_qtdtorre' => 'nullable|integer',
        ]);

        Empreendimento::create($validated);

        return redirect()->route('empreendimentos.index')->with('success', 'Condominium created successfully.');
    }

    public function show($id)
    {
        $empreendimento = Empreendimento::with(['torres.ambientes.items'])->findOrFail($id);

        return response()->json($empreendimento);
    }

    public function update(Request $request, $id)
    {
        $empreendimento = Empreendimento::findOrFail($id);

        $validated = $request->validate([
            'empreendimento_nome' => 'sometimes|string|max:255',
            'empreendimento_status' => 'sometimes|in:ativo,bloqueado',
        ]);

        $empreendimento->update($validated);

        return redirect()->route('empreendimentos.index')->with('success', 'Condominium updated successfully.');
    }
}
