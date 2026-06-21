<?php

namespace App\Repositories\Multa;

use App\Models\Multa;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class EloquentMultaRepository implements MultaRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listarPaginado(array $filtros = []): LengthAwarePaginator
    {
        $perPage = min(max((int) ($filtros['per_page'] ?? 20), 1), 100);
        $busca = trim((string) ($filtros['q'] ?? ''));
        $operador = DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return Multa::query()
            ->with(['itemEmprestimo.emprestimo.usuario', 'itemEmprestimo.exemplar.livro'])
            ->when(isset($filtros['status']), fn ($q) => $q->where('multas.status', $filtros['status']))
            ->when(isset($filtros['motivo']), fn ($q) => $q->where('multas.motivo', $filtros['motivo']))
            ->when(isset($filtros['id_usuario']), fn ($q) => $q->whereHas('itemEmprestimo.emprestimo', fn ($sub) => $sub->where('id_usuario', $filtros['id_usuario'])))
            ->when($busca !== '', fn ($q) => $q->whereHas('itemEmprestimo.emprestimo.usuario', fn ($sub) => $sub->where('nome_completo', $operador, "%{$busca}%")->orWhere('email', $operador, "%{$busca}%"))
            )
            ->when(isset($filtros['de']), fn ($q) => $q->where('multas.created_at', '>=', $filtros['de']))
            ->when(isset($filtros['ate']), fn ($q) => $q->where('multas.created_at', '<=', $filtros['ate'].' 23:59:59'))
            ->orderByDesc('multas.id_multa')
            ->paginate($perPage);
    }

    public function acharPorId(int $id): ?Multa
    {
        return Multa::query()
            ->with(['itemEmprestimo.emprestimo.usuario', 'itemEmprestimo.exemplar.livro', 'bibliotecarioBaixa'])
            ->find($id);
    }

    public function buscarPorItemEMotivo(int $idItemEmprestimo, string $motivo): ?Multa
    {
        return Multa::query()
            ->where('id_item_emprestimo', $idItemEmprestimo)
            ->where('motivo', $motivo)
            ->first();
    }

    /**
     * @return Collection<int, Multa>
     */
    public function buscarPendentesDoUsuario(int $idUsuario): Collection
    {
        return Multa::query()
            ->with(['itemEmprestimo.exemplar.livro'])
            ->where('multas.status', 'pendente')
            ->whereHas('itemEmprestimo.emprestimo', fn ($q) => $q->where('id_usuario', $idUsuario))
            ->orderByDesc('multas.id_multa')
            ->get();
    }

    /**
     * @return array{quantidade_pendente: int, valor_total_pendente: string}
     */
    public function resumoPendentesDoUsuario(int $idUsuario): array
    {
        $resultado = Multa::query()
            ->where('multas.status', 'pendente')
            ->whereHas('itemEmprestimo.emprestimo', fn ($q) => $q->where('id_usuario', $idUsuario))
            ->selectRaw('COUNT(*) as quantidade_pendente, COALESCE(SUM(valor), 0) as valor_total_pendente')
            ->first();

        return [
            'quantidade_pendente' => (int) $resultado->quantidade_pendente,
            'valor_total_pendente' => number_format((float) $resultado->valor_total_pendente, 2, '.', ''),
        ];
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(array $dados): Multa
    {
        return Multa::query()->create($dados)->refresh();
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizar(Multa $multa, array $dados): Multa
    {
        $multa->update($dados);

        return $multa->refresh();
    }
}
