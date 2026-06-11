<?php

namespace App\Repositories\Catalog;

use App\Models\Exemplar;
use Illuminate\Support\Collection;

interface ExemplarRepositoryInterface
{
    /**
     * @return Collection<int, Exemplar>
     */
    public function criarEmLote(int $idLivro, int $quantidade): Collection;

    /**
     * @return Collection<int, Exemplar>
     */
    public function listarPorLivro(int $idLivro): Collection;

    public function acharPorId(int $id): ?Exemplar;
}
