<?php

namespace App\Models;

use App\Domain\SolicitacaoEmprestimo\StatusSolicitacaoEmprestimo;
use App\Models\Concerns\AuditableTrait;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SolicitacaoEmprestimo extends Model
{
    use AuditableTrait;

    protected $table = 'solicitacoes_emprestimo';

    protected $primaryKey = 'id_solicitacao_emprestimo';

    protected $fillable = [
        'id_usuario',
        'id_livro',
        'id_emprestimo',
        'status',
        'observacoes',
        'justificativa_recusa',
        'id_bibliotecario_responsavel',
        'data_decisao',
    ];

    /**
     * @return BelongsTo<Usuario, SolicitacaoEmprestimo>
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    /**
     * @return BelongsTo<Livro, SolicitacaoEmprestimo>
     */
    public function livro(): BelongsTo
    {
        return $this->belongsTo(Livro::class, 'id_livro', 'id_livro');
    }

    /**
     * @return BelongsTo<Emprestimo, SolicitacaoEmprestimo>
     */
    public function emprestimo(): BelongsTo
    {
        return $this->belongsTo(Emprestimo::class, 'id_emprestimo', 'id_emprestimo');
    }

    /**
     * @return BelongsTo<Usuario, SolicitacaoEmprestimo>
     */
    public function bibliotecarioResponsavel(): BelongsTo
    {
        return $this->belongsTo(Usuario::class, 'id_bibliotecario_responsavel', 'id_usuario');
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => StatusSolicitacaoEmprestimo::class,
            'data_decisao' => 'datetime',
        ];
    }
}
