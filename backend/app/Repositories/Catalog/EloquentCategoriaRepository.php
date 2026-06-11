<?php

namespace App\Repositories\Catalog;

use App\Models\Categoria;

class EloquentCategoriaRepository implements CategoriaRepositoryInterface
{
    public function criar(string $nome): Categoria
    {
        return Categoria::query()->create(['nome' => $nome]);
    }

    public function acharOuCriarPorNome(string $nome): Categoria
    {
        return Categoria::query()->firstOrCreate(['nome' => $nome]);
    }

    public function acharPorId(int $id): ?Categoria
    {
        return Categoria::query()->find($id);
    }
}
