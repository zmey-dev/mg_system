<?php

namespace App\Http\Controllers;

use App\Models\Empreendimento;
use App\Rules\ValidCnpj;
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
            'empreendimento_cnpj' => ['required', 'string', 'max:20', new ValidCnpj],
            'empreendimento_endereco' => 'required|string|max:255',
            'empreendimento_numero' => 'required|string|max:10',
            'empreendimento_cep' => 'required|string|max:10',
            'empreendimento_cidade' => 'required|string|max:100',
            'empreendimento_uf' => 'required|string|size:2',
            'empreendimento_qtdtorre' => 'nullable|integer',
        ]);

        Empreendimento::create($validated);

        // Redirect back to where the request came from (Parameters or Empreendimentos page)
        if ($request->header('referer') && str_contains($request->header('referer'), '/parameters')) {
            return redirect()->route('parameters')->with('success', 'Empreendimento created successfully.');
        }

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
            'empreendimento_cnpj' => ['sometimes', 'string', 'max:20', new ValidCnpj],
            'empreendimento_endereco' => 'sometimes|string|max:255',
            'empreendimento_numero' => 'sometimes|string|max:10',
            'empreendimento_cep' => 'sometimes|string|max:10',
            'empreendimento_cidade' => 'sometimes|string|max:100',
            'empreendimento_uf' => 'sometimes|string|size:2',
            'empreendimento_qtdtorre' => 'nullable|integer',
            'empreendimento_status' => 'sometimes|in:ativo,bloqueado',
        ]);

        $empreendimento->update($validated);

        // Redirect back to where the request came from (Parameters or Empreendimentos page)
        if ($request->header('referer') && str_contains($request->header('referer'), '/parameters')) {
            return redirect()->route('parameters')->with('success', 'Empreendimento updated successfully.');
        }

        return redirect()->route('empreendimentos.index')->with('success', 'Condominium updated successfully.');
    }

    public function destroy(Request $request, $id)
    {
        $empreendimento = Empreendimento::findOrFail($id);

        if ($empreendimento->torres()->count() > 0) {
            return back()->withErrors(['error' => 'Não pode ser excluído por estar em uso.']);
        }

        $empreendimento->delete();

        // Redirect back to where the request came from (Parameters or Empreendimentos page)
        if ($request->header('referer') && str_contains($request->header('referer'), '/parameters')) {
            return redirect()->route('parameters')->with('success', 'Empreendimento deleted successfully.');
        }

        return redirect()->route('empreendimentos.index')->with('success', 'Condominium deleted successfully.');
    }
}
