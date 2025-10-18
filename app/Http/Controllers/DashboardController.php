<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
use App\Models\ItemGrupo;
use App\Models\ItemSubgrupo;
use App\Models\Torre;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;
        $search = $request->input('search');
        $grupoId = $request->input('grupo_id');
        $subgrupoId = $request->input('subgrupo_id');

        $query = Atividade::with(['item.ambiente.torre', 'item.subgrupo.grupo', 'tipo', 'profissional']);

        // Master can see all activities, others see only their empreendimento
        if ($user->role !== 'master' && $empreendimentoId) {
            $query->whereHas('item.ambiente.torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
            });
        }

        // Group filter
        if ($grupoId) {
            $query->whereHas('item.subgrupo', function ($q) use ($grupoId) {
                $q->where('itemgrupo_id', $grupoId);
            });
        }

        // Subgroup filter
        if ($subgrupoId) {
            $query->whereHas('item', function ($q) use ($subgrupoId) {
                $q->where('itemsubgrupo_id', $subgrupoId);
            });
        }

        // Search functionality
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('atividade_descricao', 'ILIKE', "%{$search}%")
                  ->orWhereHas('item', function ($q) use ($search) {
                      $q->where('item_nome', 'ILIKE', "%{$search}%");
                  });
            });
        }

        $today = Carbon::today();
        $nextWeekStart = Carbon::today()->addWeek()->startOfWeek();
        $nextWeekEnd = Carbon::today()->addWeek()->endOfWeek();
        $nextMonthStart = Carbon::today()->addMonth()->startOfMonth();
        $nextMonthEnd = Carbon::today()->addMonth()->endOfMonth();

        $atrasadas = (clone $query)
            ->where('atividade_status', '!=', 'concluida')
            ->where('atividade_dtestimada', '<', $today)
            ->count();

        $hoje = (clone $query)
            ->where('atividade_status', 'ativa')
            ->whereDate('atividade_dtestimada', $today)
            ->count();

        $proximaSemana = (clone $query)
            ->where('atividade_status', 'ativa')
            ->where('atividade_dtestimada', '>=', $nextWeekStart)
            ->where('atividade_dtestimada', '<=', $nextWeekEnd)
            ->count();

        $proximoMes = (clone $query)
            ->where('atividade_status', 'ativa')
            ->where('atividade_dtestimada', '>=', $nextMonthStart)
            ->where('atividade_dtestimada', '<=', $nextMonthEnd)
            ->count();

        $recentes = $query
            ->where('atividade_status', 'ativa')
            ->orderBy('atividade_dtestimada', 'asc')
            ->limit(10)
            ->get();

        // Master can see all torres, others see only their empreendimento
        if ($user->role === 'master') {
            $torres = Torre::select('torre_id', 'torre_nome')->get();
        } else {
            $torres = Torre::where('empreendimento_id', $empreendimentoId)
                ->select('torre_id', 'torre_nome')
                ->get();
        }

        // Get all grupos and subgrupos
        $grupos = ItemGrupo::select('itemgrupo_id', 'itemgrupo_nome')
            ->orderBy('itemgrupo_nome')
            ->get();

        $subgrupos = ItemSubgrupo::select('itemsubgrupo_id', 'itemsubgrupo_nome', 'itemgrupo_id')
            ->orderBy('itemsubgrupo_nome')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'atrasadas' => $atrasadas,
                'hoje' => $hoje,
                'proximaSemana' => $proximaSemana,
                'proximoMes' => $proximoMes,
            ],
            'recentes' => $recentes,
            'torres' => $torres,
            'grupos' => $grupos,
            'subgrupos' => $subgrupos,
            'filters' => [
                'grupo_id' => $grupoId,
                'subgrupo_id' => $subgrupoId,
            ],
        ]);
    }
}
