<?php

namespace App\Http\Controllers;

use App\Models\DoctoTipo;
use App\Models\Empreendimento;
use App\Models\ItemGrupo;
use App\Models\ItemSubgrupo;
use App\Models\Origem;
use App\Models\Periodo;
use App\Models\Profissional;
use App\Models\Tipo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ParametersController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Parameters', [
            'empreendimentos' => Empreendimento::all(),
            'grupos' => ItemGrupo::with('subgrupos')->get(),
            'subgrupos' => ItemSubgrupo::with('grupo')->get(),
            'origens' => Origem::all(),
            'tipos' => Tipo::all(),
            'doctoTipos' => DoctoTipo::all(),
            'periodos' => Periodo::all(),
            'profissionais' => Profissional::all(),
        ]);
    }

    public function storeGrupo(Request $request)
    {
        $validated = $request->validate([
            'itemgrupo_nome' => 'required|string|max:100',
            'itemgrupo_descricao' => 'nullable|string',
        ]);

        ItemGrupo::create($validated);

        return redirect()->route('parameters')->with('success', 'Group created successfully.');
    }

    public function storeOrigem(Request $request)
    {
        $validated = $request->validate([
            'origem_nome' => 'required|string|max:50',
        ]);

        Origem::create($validated);

        return redirect()->route('parameters')->with('success', 'Origin created successfully.');
    }

    public function storeTipo(Request $request)
    {
        $validated = $request->validate([
            'tipo_nome' => 'required|string|max:50',
        ]);

        Tipo::create($validated);

        return redirect()->route('parameters')->with('success', 'Type created successfully.');
    }

    public function storeDoctoTipo(Request $request)
    {
        $validated = $request->validate([
            'doctotipo_nome' => 'required|string|max:50',
        ]);

        DoctoTipo::create($validated);

        return redirect()->route('parameters')->with('success', 'Document type created successfully.');
    }

    public function storePeriodo(Request $request)
    {
        $validated = $request->validate([
            'periodo_nome' => 'required|string|max:50',
            'periodo_dias' => 'nullable|integer|min:1',
        ]);

        Periodo::create($validated);

        return redirect()->route('parameters')->with('success', 'Period created successfully.');
    }

    public function storeProfissional(Request $request)
    {
        $validated = $request->validate([
            'profissional_tipo' => 'required|string|max:100',
            'profissional_descricao' => 'nullable|string',
        ]);

        Profissional::create($validated);

        return redirect()->route('parameters')->with('success', 'Professional type created successfully.');
    }

    public function updateGrupo(Request $request, $id)
    {
        $grupo = ItemGrupo::findOrFail($id);
        $validated = $request->validate([
            'itemgrupo_nome' => 'required|string|max:100',
            'itemgrupo_descricao' => 'nullable|string',
        ]);
        $grupo->update($validated);
        return redirect()->route('parameters')->with('success', 'Group updated successfully.');
    }

    public function updateOrigem(Request $request, $id)
    {
        $origem = Origem::findOrFail($id);
        $validated = $request->validate([
            'origem_nome' => 'required|string|max:50',
        ]);
        $origem->update($validated);
        return redirect()->route('parameters')->with('success', 'Origin updated successfully.');
    }

    public function updateTipo(Request $request, $id)
    {
        $tipo = Tipo::findOrFail($id);
        $validated = $request->validate([
            'tipo_nome' => 'required|string|max:50',
        ]);
        $tipo->update($validated);
        return redirect()->route('parameters')->with('success', 'Type updated successfully.');
    }

    public function updateDoctoTipo(Request $request, $id)
    {
        $doctoTipo = DoctoTipo::findOrFail($id);
        $validated = $request->validate([
            'doctotipo_nome' => 'required|string|max:50',
        ]);
        $doctoTipo->update($validated);
        return redirect()->route('parameters')->with('success', 'Document type updated successfully.');
    }

    public function updatePeriodo(Request $request, $id)
    {
        $periodo = Periodo::findOrFail($id);
        $validated = $request->validate([
            'periodo_nome' => 'required|string|max:50',
            'periodo_dias' => 'nullable|integer|min:1',
        ]);
        $periodo->update($validated);
        return redirect()->route('parameters')->with('success', 'Period updated successfully.');
    }

    public function updateProfissional(Request $request, $id)
    {
        $profissional = Profissional::findOrFail($id);
        $validated = $request->validate([
            'profissional_tipo' => 'required|string|max:100',
            'profissional_descricao' => 'nullable|string',
        ]);
        $profissional->update($validated);
        return redirect()->route('parameters')->with('success', 'Professional type updated successfully.');
    }

    public function destroyGrupo($id)
    {
        $grupo = ItemGrupo::findOrFail($id);
        $grupo->delete();

        return redirect()->route('parameters')->with('success', 'Grupo excluído com sucesso.');
    }

    public function destroyOrigem($id)
    {
        $origem = Origem::findOrFail($id);
        $origem->delete();

        return redirect()->route('parameters')->with('success', 'Origem excluída com sucesso.');
    }

    public function destroyTipo($id)
    {
        $tipo = Tipo::findOrFail($id);
        $tipo->delete();

        return redirect()->route('parameters')->with('success', 'Tipo excluído com sucesso.');
    }

    public function destroyDoctoTipo($id)
    {
        $doctoTipo = DoctoTipo::findOrFail($id);
        $doctoTipo->delete();

        return redirect()->route('parameters')->with('success', 'Tipo de documento excluído com sucesso.');
    }

    public function destroyPeriodo($id)
    {
        $periodo = Periodo::findOrFail($id);
        $periodo->delete();

        return redirect()->route('parameters')->with('success', 'Período excluído com sucesso.');
    }

    public function destroyProfissional($id)
    {
        $profissional = Profissional::findOrFail($id);
        $profissional->delete();

        return redirect()->route('parameters')->with('success', 'Tipo de profissional excluído com sucesso.');
    }

    public function storeSubgrupo(Request $request)
    {
        $validated = $request->validate([
            'itemgrupo_id' => 'required|exists:itemgrupo,itemgrupo_id',
            'itemsubgrupo_nome' => 'required|string|max:100',
            'itemsubgrupo_descricao' => 'nullable|string',
        ]);

        ItemSubgrupo::create($validated);

        return redirect()->route('parameters')->with('success', 'Subgroup created successfully.');
    }

    public function updateSubgrupo(Request $request, $id)
    {
        $subgrupo = ItemSubgrupo::findOrFail($id);
        $validated = $request->validate([
            'itemgrupo_id' => 'sometimes|exists:itemgrupo,itemgrupo_id',
            'itemsubgrupo_nome' => 'sometimes|string|max:100',
            'itemsubgrupo_descricao' => 'nullable|string',
        ]);
        $subgrupo->update($validated);
        return redirect()->route('parameters')->with('success', 'Subgroup updated successfully.');
    }

    public function destroySubgrupo($id)
    {
        $subgrupo = ItemSubgrupo::findOrFail($id);
        $subgrupo->delete();

        return redirect()->route('parameters')->with('success', 'Subgrupo excluído com sucesso.');
    }
}
