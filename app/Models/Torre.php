<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Torre extends Model
{
    protected $table = 'torre';
    protected $primaryKey = 'torre_id';

    protected $fillable = [
        'empreendimento_id',
        'torre_nome',
        'torre_qtdaptos',
    ];

    protected $casts = [
        'torre_qtdaptos' => 'integer',
    ];

    public function empreendimento(): BelongsTo
    {
        return $this->belongsTo(Empreendimento::class, 'empreendimento_id', 'empreendimento_id');
    }

    public function ambientes(): HasMany
    {
        return $this->hasMany(Ambiente::class, 'torre_id', 'torre_id');
    }
}
