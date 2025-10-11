<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Periodo extends Model
{
    protected $table = 'periodo';
    protected $primaryKey = 'periodo_id';

    protected $fillable = [
        'periodo_nome',
        'periodo_dias',
    ];

    protected $casts = [
        'periodo_dias' => 'integer',
    ];

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, 'periodo_id', 'periodo_id');
    }
}
