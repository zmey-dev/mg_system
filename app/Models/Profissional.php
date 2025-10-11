<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Profissional extends Model
{
    protected $table = 'profissional';
    protected $primaryKey = 'profissional_id';

    protected $fillable = [
        'profissional_tipo',
        'profissional_descricao',
    ];

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, 'profissional_id', 'profissional_id');
    }
}
