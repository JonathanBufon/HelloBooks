<?php

namespace App\Repositories\Catalog;

use App\Models\Editora;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface EditoraRepositoryInterface
{
    public function criar(string $nome): Editora;

    public function acharPorId(int $id): ?Editora;

    public function acharOuCriarPorNome(string $nome): Editora;

    /**
     * @return LengthAwarePaginator<int, Editora>
     */
    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator;
}
