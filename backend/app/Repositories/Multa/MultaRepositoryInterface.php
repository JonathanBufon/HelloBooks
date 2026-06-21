<?php

namespace App\Repositories\Multa;

use App\Models\Multa;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface MultaRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listarPaginado(array $filtros = []): LengthAwarePaginator;

    public function acharPorId(int $id): ?Multa;

    public function buscarPorItemEMotivo(int $idItemEmprestimo, string $motivo): ?Multa;

    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Multa>
     */
    public function buscarPendentesDoUsuario(int $idUsuario): \Illuminate\Database\Eloquent\Collection;

    /**
     * @return array{quantidade_pendente: int, valor_total_pendente: string}
     */
    public function resumoPendentesDoUsuario(int $idUsuario): array;

    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(array $dados): Multa;

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizar(Multa $multa, array $dados): Multa;
}
