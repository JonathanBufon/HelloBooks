<?php

namespace App\Repositories\Catalog;

use App\Models\Categoria;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface CategoriaRepositoryInterface
{
    public function criar(string $nome): Categoria;

    public function acharOuCriarPorNome(string $nome): Categoria;

    public function acharPorId(int $id): ?Categoria;

    /**
     * @return LengthAwarePaginator<int, Categoria>
     */
    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator;
}
