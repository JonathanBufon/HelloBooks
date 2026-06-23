<?php

namespace App\Services;

use App\Domain\Exceptions\DomainException;
use App\Domain\Exceptions\TransicaoInvalidaException;
use App\Domain\SolicitacaoEmprestimo\StatusSolicitacaoEmprestimo;
use App\Models\Emprestimo;
use App\Models\Exemplar;
use App\Models\ItemEmprestimo;
use App\Models\Livro;
use App\Models\SolicitacaoEmprestimo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class SolicitacaoEmprestimoService
{
    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listar(array $filtros = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filtros['per_page'] ?? 20), 1), 100);
        $busca = trim((string) ($filtros['q'] ?? ''));
        $operador = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return SolicitacaoEmprestimo::query()
            ->with(['usuario', 'livro', 'emprestimo', 'bibliotecarioResponsavel'])
            ->when(isset($filtros['status']), fn ($q) => $q->where('status', $filtros['status']))
            ->when(isset($filtros['id_usuario']), fn ($q) => $q->where('id_usuario', $filtros['id_usuario']))
            ->when($busca !== '', fn ($q) => $q->where(function ($sub) use ($busca, $operador): void {
                $sub->whereHas('usuario', fn ($usuario) => $usuario->where('nome_completo', $operador, "%{$busca}%")->orWhere('email', $operador, "%{$busca}%"))
                    ->orWhereHas('livro', fn ($livro) => $livro->where('titulo', $operador, "%{$busca}%")->orWhere('isbn', $operador, "%{$busca}%"));
            }))
            ->orderByDesc('id_solicitacao_emprestimo')
            ->paginate($perPage);
    }

    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listarDoUsuario(int $idUsuario, array $filtros = []): LengthAwarePaginator
    {
        $filtros['id_usuario'] = $idUsuario;

        return $this->listar($filtros);
    }

    public function criar(int $idUsuario, int $idLivro, ?string $observacoes = null): SolicitacaoEmprestimo
    {
        return DB::transaction(function () use ($idUsuario, $idLivro, $observacoes): SolicitacaoEmprestimo {
            abort_if(Livro::query()->whereKey($idLivro)->doesntExist(), 404, 'Livro nao encontrado.');

            $pendente = SolicitacaoEmprestimo::query()
                ->where('id_usuario', $idUsuario)
                ->where('id_livro', $idLivro)
                ->where('status', StatusSolicitacaoEmprestimo::Pendente)
                ->exists();

            if ($pendente) {
                throw new DomainException('SOLICITACAO_DUPLICADA', 'Voce ja possui uma solicitacao pendente para este livro.');
            }

            $temExemplarDisponivel = Exemplar::query()
                ->where('id_livro', $idLivro)
                ->where('status', 'disponivel')
                ->exists();

            if (! $temExemplarDisponivel) {
                throw new DomainException('EXEMPLAR_INDISPONIVEL', 'Nao ha exemplar disponivel para este livro no momento.');
            }

            return SolicitacaoEmprestimo::query()
                ->create([
                    'id_usuario' => $idUsuario,
                    'id_livro' => $idLivro,
                    'status' => StatusSolicitacaoEmprestimo::Pendente,
                    'observacoes' => $observacoes,
                ])
                ->load(['usuario', 'livro', 'emprestimo', 'bibliotecarioResponsavel']);
        });
    }

    public function cancelarDoUsuario(int $idSolicitacao, int $idUsuario): SolicitacaoEmprestimo
    {
        return DB::transaction(function () use ($idSolicitacao, $idUsuario): SolicitacaoEmprestimo {
            $solicitacao = SolicitacaoEmprestimo::query()
                ->where('id_usuario', $idUsuario)
                ->lockForUpdate()
                ->find($idSolicitacao);
            abort_if($solicitacao === null, 404, 'Solicitacao de emprestimo nao encontrada.');

            $this->garantirPendente($solicitacao);

            $solicitacao->update([
                'status' => StatusSolicitacaoEmprestimo::Cancelada,
                'data_decisao' => now(),
            ]);

            return $solicitacao->refresh()->load(['usuario', 'livro', 'emprestimo', 'bibliotecarioResponsavel']);
        });
    }

    public function aprovar(int $idSolicitacao, int $idBibliotecario): SolicitacaoEmprestimo
    {
        return DB::transaction(function () use ($idSolicitacao, $idBibliotecario): SolicitacaoEmprestimo {
            $solicitacao = $this->buscarParaDecisao($idSolicitacao);
            $this->garantirPendente($solicitacao);

            $exemplar = Exemplar::query()
                ->where('id_livro', $solicitacao->id_livro)
                ->where('status', 'disponivel')
                ->orderBy('id_exemplar')
                ->lockForUpdate()
                ->first();

            if ($exemplar === null) {
                throw new DomainException('EXEMPLAR_INDISPONIVEL', 'Nao ha exemplar disponivel para aprovar esta solicitacao.');
            }

            $emprestimo = Emprestimo::query()->create([
                'id_usuario' => $solicitacao->id_usuario,
                'data_retirada' => now(),
                'data_devolucao_prevista' => now()->addDays(14)->toDateString(),
                'status' => 'ativo',
            ]);

            ItemEmprestimo::query()->create([
                'id_emprestimo' => $emprestimo->id_emprestimo,
                'id_exemplar' => $exemplar->id_exemplar,
            ]);

            $exemplar->update(['status' => 'emprestado']);
            $solicitacao->update([
                'status' => StatusSolicitacaoEmprestimo::Aprovada,
                'id_emprestimo' => $emprestimo->id_emprestimo,
                'id_bibliotecario_responsavel' => $idBibliotecario,
                'data_decisao' => now(),
            ]);

            return $solicitacao->refresh()->load(['usuario', 'livro', 'emprestimo', 'bibliotecarioResponsavel']);
        });
    }

    public function recusar(int $idSolicitacao, string $justificativa, int $idBibliotecario): SolicitacaoEmprestimo
    {
        return DB::transaction(function () use ($idSolicitacao, $justificativa, $idBibliotecario): SolicitacaoEmprestimo {
            $solicitacao = $this->buscarParaDecisao($idSolicitacao);
            $this->garantirPendente($solicitacao);

            $solicitacao->update([
                'status' => StatusSolicitacaoEmprestimo::Recusada,
                'justificativa_recusa' => $justificativa,
                'id_bibliotecario_responsavel' => $idBibliotecario,
                'data_decisao' => now(),
            ]);

            return $solicitacao->refresh()->load(['usuario', 'livro', 'emprestimo', 'bibliotecarioResponsavel']);
        });
    }

    private function buscarParaDecisao(int $idSolicitacao): SolicitacaoEmprestimo
    {
        $solicitacao = SolicitacaoEmprestimo::query()
            ->with(['usuario', 'livro'])
            ->lockForUpdate()
            ->find($idSolicitacao);
        abort_if($solicitacao === null, 404, 'Solicitacao de emprestimo nao encontrada.');

        return $solicitacao;
    }

    private function garantirPendente(SolicitacaoEmprestimo $solicitacao): void
    {
        if ($solicitacao->status !== StatusSolicitacaoEmprestimo::Pendente) {
            throw new TransicaoInvalidaException('Somente solicitacoes pendentes podem ser alteradas.');
        }
    }
}
