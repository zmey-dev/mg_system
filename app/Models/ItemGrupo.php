<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemGrupo extends Model
{
    protected $table = 'itemgrupo';
    protected $primaryKey = 'itemgrupo_id';

    protected $fillable = [
        'itemgrupo_nome',
        'itemgrupo_descricao',
        'itemgrupo_bloqueado',
    ];

    protected $casts = [
        'itemgrupo_bloqueado' => 'boolean',
    ];

    public function subgrupos(): HasMany
    {
        return $this->hasMany(ItemSubgrupo::class, 'itemgrupo_id', 'itemgrupo_id');
    }
}
