<?php

namespace App\Http\Controllers;

use App\Models\DoctoTipo;
use App\Models\Empreendimento;
use App\Models\Item;
use App\Models\ItemGrupo;
use App\Models\Origem;
use App\Models\Periodo;
use App\Models\Profissional;
use App\Models\Tipo;
use App\Models\Torre;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogoController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;

        // Master can see all empreendimentos, others see only their own
        if ($user->role === 'master') {
            $empreendimentos = Empreendimento::all();
            $torres = Torre::with(['ambientes.items.subgrupo.grupo'])->get();
        } else {
            $empreendimentos = Empreendimento::where('empreendimento_id', $empreendimentoId)->get();
            $torres = Torre::where('empreendimento_id', $empreendimentoId)
                ->with(['ambientes.items.subgrupo.grupo'])
                ->get();
        }

        $grupos = ItemGrupo::where('itemgrupo_bloqueado', false)
            ->with(['subgrupos.items.ambiente.torre'])
            ->get();

        return Inertia::render('Catalog', [
            'torres' => $torres,
            'grupos' => $grupos,
            'empreendimentos' => $empreendimentos,
            'origens' => Origem::all(),
            'tipos' => Tipo::all(),
            'doctoTipos' => DoctoTipo::all(),
            'periodos' => Periodo::all(),
            'profissionais' => Profissional::all(),
        ]);
    }

    public function items(Request $request)
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;

        $items = Item::with(['ambiente.torre', 'subgrupo.grupo'])
            ->whereHas('ambiente.torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
            })
            ->where('item_status', 'ativo')
            ->get();

        return response()->json($items);
    }
}
