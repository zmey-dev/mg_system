<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'empreendimento_id',
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function empreendimento(): BelongsTo
    {
        return $this->belongsTo(Empreendimento::class, 'empreendimento_id', 'empreendimento_id');
    }

    public function registros(): HasMany
    {
        return $this->hasMany(AtividadeRegistro::class, 'usuario_id', 'id');
    }

    public function atividadesCriadas(): HasMany
    {
        return $this->hasMany(Atividade::class, 'created_by', 'id');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class, 'usuario_id', 'id');
    }

    public function isMaster(): bool
    {
        return $this->role === 'master';
    }

    public function isSindico(): bool
    {
        return $this->role === 'sindico';
    }

    public function isGestor(): bool
    {
        return $this->role === 'gestor';
    }

    public function isAuditor(): bool
    {
        return $this->role === 'auditor';
    }
}
