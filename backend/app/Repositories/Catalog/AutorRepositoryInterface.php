<?php

namespace App\Repositories\Catalog;

use App\Models\Autor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface AutorRepositoryInterface
{
    public function criar(string $nome): Autor;

    public function acharOuCriarPorNome(string $nome): Autor;

    public function acharPorId(int $id): ?Autor;

    /**
     * @return LengthAwarePaginator<int, Autor>
     */
    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator;
}
