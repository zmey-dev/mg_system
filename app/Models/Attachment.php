<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attachment extends Model
{
    protected $table = 'attachment';
    protected $primaryKey = 'attachment_id';

    protected $fillable = [
        'atividaderegistro_id',
        'attachment_nome',
        'attachment_caminho',
        'attachment_tipo',
        'attachment_tamanho',
    ];

    protected $casts = [
        'attachment_tamanho' => 'integer',
    ];

    public function registro(): BelongsTo
    {
        return $this->belongsTo(AtividadeRegistro::class, 'atividaderegistro_id', 'atividaderegistro_id');
    }
}
