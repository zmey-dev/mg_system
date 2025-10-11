<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Origem extends Model
{
    protected $table = 'origem';
    protected $primaryKey = 'origem_id';

    protected $fillable = [
        'origem_nome',
    ];

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, 'origem_id', 'origem_id');
    }
}
