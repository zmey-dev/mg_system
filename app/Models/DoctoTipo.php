<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DoctoTipo extends Model
{
    protected $table = 'doctotipo';
    protected $primaryKey = 'doctotipo_id';

    protected $fillable = [
        'doctotipo_nome',
    ];

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, 'doctotipo_id', 'doctotipo_id');
    }
}
