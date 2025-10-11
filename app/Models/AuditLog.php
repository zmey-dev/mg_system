<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $table = 'audit_logs';
    protected $primaryKey = 'audit_id';

    protected $fillable = [
        'usuario_id',
        'empreendimento_id',
        'audit_action',
        'audit_table',
        'audit_record_id',
        'audit_old_values',
        'audit_new_values',
        'audit_ip',
    ];

    protected $casts = [
        'audit_old_values' => 'array',
        'audit_new_values' => 'array',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id', 'id');
    }

    public function empreendimento(): BelongsTo
    {
        return $this->belongsTo(Empreendimento::class, 'empreendimento_id', 'empreendimento_id');
    }
}
