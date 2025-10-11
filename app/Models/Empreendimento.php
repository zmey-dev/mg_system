<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Empreendimento extends Model
{
    protected $table = 'empreendimento';
    protected $primaryKey = 'empreendimento_id';

    protected $fillable = [
        'empreendimento_nome',
        'empreendimento_cnpj',
        'empreendimento_endereco',
        'empreendimento_numero',
        'empreendimento_cep',
        'empreendimento_cidade',
        'empreendimento_uf',
        'empreendimento_qtdtorre',
        'empreendimento_status',
    ];

    protected $casts = [
        'empreendimento_qtdtorre' => 'integer',
    ];

    public function torres(): HasMany
    {
        return $this->hasMany(Torre::class, 'empreendimento_id', 'empreendimento_id');
    }

    public function usuarios(): HasMany
    {
        return $this->hasMany(User::class, 'empreendimento_id', 'empreendimento_id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'empreendimento_id', 'empreendimento_id');
    }
}
