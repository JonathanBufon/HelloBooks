<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Emprestimo extends Model
{
    protected $table = 'emprestimos';

    protected $primaryKey = 'id_emprestimo';

    protected $fillable = [
        'id_usuario',
        'data_retirada',
        'data_devolucao_prevista',
        'data_devolucao_real',
        'status',
    ];

    /**
     * @return BelongsTo<Usuario, Emprestimo>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    /**
     * @return HasMany<ItemEmprestimo>
     */
    public function itens(): HasMany
    {
        return $this->hasMany(ItemEmprestimo::class, 'id_emprestimo', 'id_emprestimo');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data_retirada' => 'datetime',
            'data_devolucao_prevista' => 'date',
            'data_devolucao_real' => 'datetime',
        ];
    }
}
