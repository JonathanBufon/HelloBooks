<?php

namespace App\Repositories;

use App\Models\LogAtividade;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

interface LogRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listar(array $filtros = []): LengthAwarePaginator;

    /**
     * @return Collection<int, LogAtividade>
     */
    public function recentes(int $limite = 10): Collection;
}
