<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
use App\Models\Attachment;
use App\Models\AtividadeRegistro;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AtividadeRegistroController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $empreendimentoId = $user->empreendimento_id;
        $dateFilter = $request->input('date_filter');
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = AtividadeRegistro::with([
            'atividade.item.ambiente.torre',
            'usuario',
            'attachments'
        ]);

        // Master can see all registros, others see only their empreendimento
        if ($user->role !== 'master') {
            $query->whereHas('atividade.item.ambiente.torre', function ($q) use ($empreendimentoId) {
                $q->where('empreendimento_id', $empreendimentoId);
            });
        }

        // Date range filters (based on atividaderegistro_dtinicio)
        if ($dateFilter && $dateFilter !== 'all') {
            $today = Carbon::today();

            switch ($dateFilter) {
                case 'today':
                    $query->whereDate('atividaderegistro_dtinicio', $today);
                    break;
                case 'this_week':
                    $query->whereBetween('atividaderegistro_dtinicio', [
                        $today->startOfWeek(),
                        $today->copy()->endOfWeek()
                    ]);
                    break;
                case 'this_month':
                    $query->whereBetween('atividaderegistro_dtinicio', [
                        $today->copy()->startOfMonth(),
                        $today->copy()->endOfMonth()
                    ]);
                    break;
                case 'last_7_days':
                    $query->whereBetween('atividaderegistro_dtinicio', [
                        $today->copy()->subDays(7),
                        $today
                    ]);
                    break;
                case 'last_15_days':
                    $query->whereBetween('atividaderegistro_dtinicio', [
                        $today->copy()->subDays(15),
                        $today
                    ]);
                    break;
                case 'last_30_days':
                    $query->whereBetween('atividaderegistro_dtinicio', [
                        $today->copy()->subDays(30),
                        $today
                    ]);
                    break;
                case 'custom':
                    if ($startDate && $endDate) {
                        $query->whereBetween('atividaderegistro_dtinicio', [
                            Carbon::parse($startDate),
                            Carbon::parse($endDate)
                        ]);
                    }
                    break;
            }
        }

        $registros = $query->orderBy('atividaderegistro_dtinicio', 'desc')
            ->paginate(20);

        return Inertia::render('Registros', [
            'registros' => $registros,
            'filters' => [
                'date_filter' => $dateFilter,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'atividade_id' => 'required|exists:atividade,atividade_id',
            'atividaderegistro_dtinicio' => 'required|date',
            'atividaderegistro_observacoes' => 'nullable|string',
        ]);

        $validated['usuario_id'] = $request->user()->id;
        $validated['status'] = 'em_andamento';

        $registro = AtividadeRegistro::create($validated);

        $atividade = Atividade::find($validated['atividade_id']);
        $atividade->update(['atividade_status' => 'ativa']);

        return redirect()->back()->with('success', 'Registro started successfully.');
    }

    public function show(Request $request, $id)
    {
        $registro = AtividadeRegistro::with([
            'atividade.item.ambiente.torre',
            'atividade.item.subgrupo.grupo',
            'atividade.origem',
            'atividade.tipo',
            'atividade.doctoTipo',
            'atividade.periodo',
            'atividade.profissional',
            'usuario',
            'attachments'
        ])->findOrFail($id);

        return Inertia::render('RegistroDetail', [
            'registro' => $registro,
        ]);
    }

    public function update(Request $request, $id)
    {
        $registro = AtividadeRegistro::findOrFail($id);

        $validated = $request->validate([
            'atividaderegistro_observacoes' => 'nullable|string',
            'costs_json' => 'nullable|array',
        ]);

        $registro->update($validated);

        return redirect()->route('registros.index')->with('success', 'Registro updated successfully.');
    }

    public function complete(Request $request, $id)
    {
        $registro = AtividadeRegistro::with('atividade.periodo')->findOrFail($id);

        $validated = $request->validate([
            'atividaderegistro_dtrealizada' => 'required|date',
            'atividaderegistro_observacoes' => 'nullable|string',
            'costs_json' => 'nullable|array',
        ]);

        // Validate files separately to handle array structure properly
        if ($request->hasFile('photos')) {
            $request->validate([
                'photos.*' => 'image|max:5120',
            ]);
        }

        if ($request->hasFile('documents')) {
            $request->validate([
                'documents.*' => 'file|mimes:pdf,jpg,jpeg,png|max:10240',
            ]);
        }

        $validated['status'] = 'concluida';

        $dtRealizada = Carbon::parse($validated['atividaderegistro_dtrealizada']);
        $periodoDias = $registro->atividade->periodo->periodo_dias ?? 0;

        if ($periodoDias > 0) {
            $validated['atividaderegistro_dtproxima'] = $dtRealizada->copy()->addDays($periodoDias);
        }

        $registro->update($validated);

        // Process photo uploads
        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('registros/photos', 'public');
                Attachment::create([
                    'atividaderegistro_id' => $registro->atividaderegistro_id,
                    'attachment_nome' => $photo->getClientOriginalName(),
                    'attachment_caminho' => $path,
                    'attachment_tipo' => 'photo',
                    'attachment_tamanho' => $photo->getSize(),
                ]);
            }
        }

        // Process document uploads
        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $doc) {
                $path = $doc->store('registros/documents', 'public');
                Attachment::create([
                    'atividaderegistro_id' => $registro->atividaderegistro_id,
                    'attachment_nome' => $doc->getClientOriginalName(),
                    'attachment_caminho' => $path,
                    'attachment_tipo' => 'document',
                    'attachment_tamanho' => $doc->getSize(),
                ]);
            }
        }

        $atividade = $registro->atividade;
        if (isset($validated['atividaderegistro_dtproxima'])) {
            $atividade->update([
                'atividade_dtestimada' => $validated['atividaderegistro_dtproxima']
            ]);
        }

        return redirect()->route('registros.index')->with('success', 'Registro completed successfully.');
    }

    public function downloadAttachment($id)
    {
        $attachment = Attachment::findOrFail($id);
        $filePath = storage_path('app/public/' . $attachment->attachment_caminho);

        if (!file_exists($filePath)) {
            abort(404, 'File not found');
        }

        return response()->download($filePath, $attachment->attachment_nome);
    }
}
