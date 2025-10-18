<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
use App\Models\DoctoTipo;
use App\Models\Origem;
use App\Models\Periodo;
use App\Models\Profissional;
use App\Models\Tipo;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AtividadeController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;
        $search = $request->input('search');
        $dateFilter = $request->input('date_filter');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = Atividade::with([
            'item.ambiente.torre',
            'origem',
            'tipo',
            'doctoTipo',
            'periodo',
            'profissional',
            'creator'
        ]);

        if ($empreendimentoId) {
            $query->whereHas('item.ambiente.torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
            });
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('atividade_descricao', 'ILIKE', "%{$search}%")
                  ->orWhereHas('item', function ($q) use ($search) {
                      $q->where('item_nome', 'ILIKE', "%{$search}%");
                  });
            });
        }

        // Date range filters
        if ($dateFilter && $dateFilter !== 'all') {
            $today = Carbon::today();

            switch ($dateFilter) {
                case 'today':
                    $query->whereDate('atividade_dtestimada', $today);
                    break;
                case 'this_week':
                    $query->whereBetween('atividade_dtestimada', [
                        $today->startOfWeek(),
                        $today->copy()->endOfWeek()
                    ]);
                    break;
                case 'next_week':
                    $nextWeek = $today->copy()->addWeek();
                    $query->whereBetween('atividade_dtestimada', [
                        $nextWeek->startOfWeek(),
                        $nextWeek->endOfWeek()
                    ]);
                    break;
                case 'this_month':
                    $query->whereBetween('atividade_dtestimada', [
                        $today->copy()->startOfMonth(),
                        $today->copy()->endOfMonth()
                    ]);
                    break;
                case 'next_month':
                    $nextMonth = $today->copy()->addMonth();
                    $query->whereBetween('atividade_dtestimada', [
                        $nextMonth->startOfMonth(),
                        $nextMonth->endOfMonth()
                    ]);
                    break;
                case 'last_7_days':
                    $query->whereBetween('atividade_dtestimada', [
                        $today->copy()->subDays(7),
                        $today
                    ]);
                    break;
                case 'last_15_days':
                    $query->whereBetween('atividade_dtestimada', [
                        $today->copy()->subDays(15),
                        $today
                    ]);
                    break;
                case 'last_30_days':
                    $query->whereBetween('atividade_dtestimada', [
                        $today->copy()->subDays(30),
                        $today
                    ]);
                    break;
                case 'overdue':
                    $query->where('atividade_dtestimada', '<', $today)
                          ->where('atividade_status', '!=', 'concluida');
                    break;
                case 'custom':
                    if ($startDate && $endDate) {
                        $query->whereBetween('atividade_dtestimada', [
                            Carbon::parse($startDate),
                            Carbon::parse($endDate)
                        ]);
                    }
                    break;
            }
        }

        $atividades = $query->orderBy('atividade_dtestimada', 'asc')
            ->paginate(20);

        $filters = [
            'origens' => Origem::all(),
            'tipos' => Tipo::all(),
            'doctoTipos' => DoctoTipo::all(),
            'periodos' => Periodo::all(),
            'profissionais' => Profissional::all(),
            'date_filter' => $dateFilter,
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];

        return Inertia::render('Activities', [
            'atividades' => $atividades,
            'filters' => $filters,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:item,item_id',
            'origem_id' => 'required|exists:origem,origem_id',
            'tipo_id' => 'required|exists:tipo,tipo_id',
            'doctotipo_id' => 'required|exists:doctotipo,doctotipo_id',
            'periodo_id' => 'required|exists:periodo,periodo_id',
            'profissional_id' => 'required|exists:profissional,profissional_id',
            'atividade_prioridade' => 'required|in:alta,media,baixa',
            'atividade_descricao' => 'required|string',
            'atividade_dtestimada' => 'nullable|date',
        ]);

        $validated['created_by'] = $request->user()->id;
        $validated['atividade_status'] = 'ativa';

        $atividade = Atividade::create($validated);

        return redirect()->route('activities')->with('success', 'Activity created successfully.');
    }

    public function show(Request $request, $id)
    {
        $atividade = Atividade::with([
            'item.ambiente.torre',
            'origem',
            'tipo',
            'doctoTipo',
            'periodo',
            'profissional',
            'creator',
            'registros.usuario',
            'registros.attachments'
        ])->findOrFail($id);

        return Inertia::render('ActivityDetail', [
            'atividade' => $atividade,
        ]);
    }

    public function update(Request $request, $id)
    {
        $atividade = Atividade::findOrFail($id);

        $validated = $request->validate([
            'atividade_prioridade' => 'sometimes|in:alta,media,baixa',
            'atividade_descricao' => 'sometimes|string',
            'atividade_dtestimada' => 'sometimes|nullable|date',
            'atividade_status' => 'sometimes|in:ativa,bloqueada,concluida',
        ]);

        $atividade->update($validated);

        return redirect()->route('activities')->with('success', 'Activity updated successfully.');
    }

    public function destroy($id)
    {
        $atividade = Atividade::findOrFail($id);
        $atividade->update(['atividade_status' => 'bloqueada']);

        return redirect()->route('activities')->with('success', 'Activity blocked successfully.');
    }
}
