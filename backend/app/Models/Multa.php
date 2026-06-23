<?php

namespace App\Models;

use App\Domain\Multa\MotivoMulta;
use App\Domain\Multa\StatusMulta;
use App\Models\Concerns\AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Multa extends Model
{
    use AuditableTrait;

    protected $table = 'multas';

    protected $primaryKey = 'id_multa';

    protected $fillable = [
        'id_item_emprestimo',
        'motivo',
        'valor',
        'status',
        'justificativa_perdao',
        'id_bibliotecario_baixa',
        'id_bibliotecario_notificacao',
        'data_baixa',
        'notificado_em',
        'notificacao_lida_em',
    ];

    /**
     * @return BelongsTo<ItemEmprestimo, Multa>
     */
    public function itemEmprestimo(): BelongsTo
    {
        return $this->belongsTo(ItemEmprestimo::class, 'id_item_emprestimo', 'id_item_emprestimo');
    }

    /**
     * @return BelongsTo<Usuario, Multa>
     */
    public function bibliotecarioBaixa(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_bibliotecario_baixa', 'id_usuario');
    }

    /**
     * @return BelongsTo<Usuario, Multa>
     */
    public function bibliotecarioNotificacao(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_bibliotecario_notificacao', 'id_usuario');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'motivo' => MotivoMulta::class,
            'status' => StatusMulta::class,
            'valor' => 'decimal:2',
            'data_baixa' => 'datetime',
            'notificado_em' => 'datetime',
            'notificacao_lida_em' => 'datetime',
        ];
    }
}
