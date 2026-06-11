<?php

namespace App\Repositories\Catalog;

use App\Models\Categoria;

interface CategoriaRepositoryInterface
{
    public function criar(string $nome): Categoria;

    public function acharOuCriarPorNome(string $nome): Categoria;

    public function acharPorId(int $id): ?Categoria;
}
