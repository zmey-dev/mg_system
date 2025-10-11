<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ambiente extends Model
{
    protected $table = 'ambiente';
    protected $primaryKey = 'ambiente_id';

    protected $fillable = [
        'torre_id',
        'ambiente_nome',
        'ambiente_descricao',
        'ambiente_imagem',
    ];

    public function torre(): BelongsTo
    {
        return $this->belongsTo(Torre::class, 'torre_id', 'torre_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(Item::class, 'ambiente_id', 'ambiente_id');
    }
}
