<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AtividadeRegistro extends Model
{
    protected $table = 'atividaderegistro';
    protected $primaryKey = 'atividaderegistro_id';

    protected $fillable = [
        'atividade_id',
        'usuario_id',
        'atividaderegistro_dtinicio',
        'atividaderegistro_dtrealizada',
        'atividaderegistro_dcto',
        'atividaderegistro_anexo',
        'atividaderegistro_observacoes',
        'atividaderegistro_dtproxima',
        'costs_json',
        'performed_by',
        'status',
    ];

    protected $casts = [
        'atividaderegistro_dtinicio' => 'datetime',
        'atividaderegistro_dtrealizada' => 'datetime',
        'atividaderegistro_dtproxima' => 'date',
        'costs_json' => 'array',
    ];

    public function atividade(): BelongsTo
    {
        return $this->belongsTo(Atividade::class, 'atividade_id', 'atividade_id');
    }

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id', 'id');
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(Attachment::class, 'atividaderegistro_id', 'atividaderegistro_id');
    }
}
