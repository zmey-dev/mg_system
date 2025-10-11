<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Atividade extends Model
{
    protected $table = 'atividade';
    protected $primaryKey = 'atividade_id';

    protected $fillable = [
        'item_id',
        'origem_id',
        'tipo_id',
        'doctotipo_id',
        'periodo_id',
        'profissional_id',
        'atividade_descricao',
        'atividade_prioridade',
        'atividade_dtestimada',
        'atividade_status',
        'created_by',
    ];

    protected $casts = [
        'atividade_dtestimada' => 'date',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class, 'item_id', 'item_id');
    }

    public function origem(): BelongsTo
    {
        return $this->belongsTo(Origem::class, 'origem_id', 'origem_id');
    }

    public function tipo(): BelongsTo
    {
        return $this->belongsTo(Tipo::class, 'tipo_id', 'tipo_id');
    }

    public function doctoTipo(): BelongsTo
    {
        return $this->belongsTo(DoctoTipo::class, 'doctotipo_id', 'doctotipo_id');
    }

    public function periodo(): BelongsTo
    {
        return $this->belongsTo(Periodo::class, 'periodo_id', 'periodo_id');
    }

    public function profissional(): BelongsTo
    {
        return $this->belongsTo(Profissional::class, 'profissional_id', 'profissional_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }

    public function registros(): HasMany
    {
        return $this->hasMany(AtividadeRegistro::class, 'atividade_id', 'atividade_id');
    }
}
