<?php

namespace App\Repositories\Catalog;

use App\Models\Autor;

class EloquentAutorRepository implements AutorRepositoryInterface
{
    public function criar(string $nome): Autor
    {
        return Autor::query()->create(['nome' => $nome]);
    }

    public function acharOuCriarPorNome(string $nome): Autor
    {
        return Autor::query()->firstOrCreate(['nome' => $nome]);
    }

    public function acharPorId(int $id): ?Autor
    {
        return Autor::query()->find($id);
    }
}
