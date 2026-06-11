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
}
