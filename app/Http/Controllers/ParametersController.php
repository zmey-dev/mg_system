<?php

namespace App\Http\Controllers;

use App\Models\DoctoTipo;
use App\Models\ItemGrupo;
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
            'grupos' => ItemGrupo::all(),
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
}
