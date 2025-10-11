<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
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

        $query = Atividade::with(['item.ambiente.torre', 'tipo', 'profissional']);

        // Only filter by empreendimento for non-master users
        if ($empreendimentoId) {
            $query->whereHas('item.ambiente.torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
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
        $weekEnd = Carbon::today()->addDays(7);

        $atrasadas = (clone $query)
            ->where('atividade_status', 'ativa')
            ->where('atividade_dtestimada', '<', $today)
            ->count();

        $hoje = (clone $query)
            ->where('atividade_status', 'ativa')
            ->whereDate('atividade_dtestimada', $today)
            ->count();

        $semana = (clone $query)
            ->where('atividade_status', 'ativa')
            ->whereBetween('atividade_dtestimada', [$today, $weekEnd])
            ->count();

        $proximas = (clone $query)
            ->where('atividade_status', 'ativa')
            ->where('atividade_dtestimada', '>', $weekEnd)
            ->count();

        $recentes = $query
            ->where('atividade_status', 'ativa')
            ->orderBy('atividade_dtestimada', 'asc')
            ->limit(10)
            ->get();

        $torres = Torre::where('empreendimento_id', $empreendimentoId)
            ->select('torre_id', 'torre_nome')
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => [
                'atrasadas' => $atrasadas,
                'hoje' => $hoje,
                'semana' => $semana,
                'proximas' => $proximas,
            ],
            'recentes' => $recentes,
            'torres' => $torres,
        ]);
    }
}
