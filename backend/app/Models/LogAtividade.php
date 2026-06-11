<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LogAtividade extends Model
{
    protected $table = 'logs_atividades';

    protected $primaryKey = 'id_log';

    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'acao_realizada',
        'entidade_afetada',
        'id_registro_afetado',
        'data_hora',
    ];

    /**
     * @return BelongsTo<Usuario, LogAtividade>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'data_hora' => 'datetime',
        ];
    }
}
