<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemSubgrupo extends Model
{
    protected $table = 'itemsubgrupo';
    protected $primaryKey = 'itemsubgrupo_id';

    protected $fillable = [
        'itemgrupo_id',
        'itemsubgrupo_nome',
        'itemsubgrupo_descricao',
        'itemsubgrupo_bloqueado',
    ];

    protected $casts = [
        'itemsubgrupo_bloqueado' => 'boolean',
    ];

    public function grupo(): BelongsTo
    {
        return $this->belongsTo(ItemGrupo::class, 'itemgrupo_id', 'itemgrupo_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'itemsubgrupo_id', 'itemsubgrupo_id');
    }
}
