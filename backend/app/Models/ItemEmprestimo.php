<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ItemEmprestimo extends Model
{
    protected $table = 'itens_emprestimo';

    protected $primaryKey = 'id_item_emprestimo';

    protected $fillable = [
        'id_emprestimo',
        'id_exemplar',
        'data_devolucao_item',
    ];

    /**
     * @return BelongsTo<Emprestimo, ItemEmprestimo>
     */
    public function emprestimo(): BelongsTo
    {
        return $this->belongsTo(Emprestimo::class, 'id_emprestimo', 'id_emprestimo');
    }

    /**
     * @return BelongsTo<Exemplar, ItemEmprestimo>
     */
    public function exemplar(): BelongsTo
    {
        return $this->belongsTo(Exemplar::class, 'id_exemplar', 'id_exemplar');
    }

    /**
     * @return HasMany<Multa>
     */
    public function multas(): HasMany
    {
        return $this->hasMany(Multa::class, 'id_item_emprestimo', 'id_item_emprestimo');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data_devolucao_item' => 'datetime',
        ];
    }
}
