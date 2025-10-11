<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemGrupo;
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

        $torres = Torre::where('empreendimento_id', $empreendimentoId)
            ->with(['ambientes.items.subgrupo.grupo'])
            ->get();

        $grupos = ItemGrupo::where('itemgrupo_bloqueado', false)
            ->with('subgrupos')
            ->get();

        return Inertia::render('Catalog', [
            'torres' => $torres,
            'grupos' => $grupos,
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
