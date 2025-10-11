<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tipo extends Model
{
    protected $table = 'tipo';
    protected $primaryKey = 'tipo_id';

    protected $fillable = [
        'tipo_nome',
    ];

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, 'tipo_id', 'tipo_id');
    }
}
