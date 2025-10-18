<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Item extends Model
{
    protected $table = 'item';
    protected $primaryKey = 'item_id';

    protected $fillable = [
        'ambiente_id',
        'itemsubgrupo_id',
        'item_nome',
        'item_marcamodelo',
        'item_descricao',
        'item_complemento',
        'item_imagem',
        'item_qrcode',
        'item_status',
    ];

    protected $appends = ['item_imagem_url'];

    public function ambiente(): BelongsTo
    {
        return $this->belongsTo(Ambiente::class, 'ambiente_id', 'ambiente_id');
    }

    public function subgrupo(): BelongsTo
    {
        return $this->belongsTo(ItemSubgrupo::class, 'itemsubgrupo_id', 'itemsubgrupo_id');
    }

    public function atividades(): HasMany
    {
        return $this->hasMany(Atividade::class, 'item_id', 'item_id');
    }

    public function getItemImagemUrlAttribute(): ?string
    {
        if (!$this->item_imagem) {
            return null;
        }

        return Storage::disk('public')->url($this->item_imagem);
    }
}
