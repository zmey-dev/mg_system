<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Ambiente;
use App\Models\ItemSubgrupo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ItemController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;

        $query = Item::with(['ambiente.torre.empreendimento', 'subgrupo.grupo']);

        if ($empreendimentoId) {
            $query->whereHas('ambiente.torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
            });
        }

        $items = $query->paginate(20);

        $ambientes = Ambiente::select('ambiente_id', 'ambiente_nome', 'torre_id')
            ->with('torre:torre_id,torre_nome,empreendimento_id')
            ->when($empreendimentoId, function ($q) use ($empreendimentoId) {
                return $q->whereHas('torre', function ($q) use ($empreendimentoId) {
                    $q->where('empreendimento_id', $empreendimentoId);
                });
            })
            ->get();

        $subgrupos = ItemSubgrupo::with('grupo')->get();

        return Inertia::render('Items', [
            'items' => $items,
            'ambientes' => $ambientes,
            'subgrupos' => $subgrupos,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ambiente_id' => 'required|exists:ambiente,ambiente_id',
            'itemsubgrupo_id' => 'required|exists:itemsubgrupo,itemsubgrupo_id',
            'item_nome' => 'required|string|max:100',
            'item_descricao' => 'nullable|string',
            'item_status' => 'nullable|in:ativo,inativo',
            'item_imagem' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('item_imagem')) {
            $path = $request->file('item_imagem')->store('items', 'public');
            $validated['item_imagem'] = $path;
        }

        Item::create($validated);

        return redirect()->route('catalog')->with('success', 'Item criado com sucesso.');
    }

    public function show($id)
    {
        $item = Item::with(['ambiente.torre.empreendimento', 'subgrupo.grupo', 'atividades'])
            ->findOrFail($id);

        return Inertia::render('ItemDetail', [
            'item' => $item
        ]);
    }

    public function update(Request $request, $id)
    {
        $item = Item::findOrFail($id);

        $validated = $request->validate([
            'item_nome' => 'sometimes|string|max:100',
            'item_descricao' => 'sometimes|string',
            'item_status' => 'sometimes|in:ativo,inativo',
            'item_imagem' => 'nullable|image|max:5120',
        ]);

        if ($request->hasFile('item_imagem')) {
            if ($item->item_imagem) {
                Storage::disk('public')->delete($item->item_imagem);
            }
            $path = $request->file('item_imagem')->store('items', 'public');
            $validated['item_imagem'] = $path;
        }

        $item->update($validated);

        return redirect()->route('catalog')->with('success', 'Item atualizado com sucesso.');
    }

    public function destroy($id)
    {
        $item = Item::findOrFail($id);

        if ($item->item_imagem) {
            Storage::disk('public')->delete($item->item_imagem);
        }

        $item->delete();

        return redirect()->route('catalog')->with('success', 'Item excluído com sucesso.');
    }
}
