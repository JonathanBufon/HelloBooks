<?php

namespace App\Repositories\Catalog;

use App\Models\Editora;

class EloquentEditoraRepository implements EditoraRepositoryInterface
{
    public function criar(string $nome): Editora
    {
        return Editora::query()->create(['nome' => $nome]);
    }

    public function acharPorId(int $id): ?Editora
    {
        return Editora::query()->find($id);
    }

    public function acharOuCriarPorNome(string $nome): Editora
    {
        return Editora::query()->firstOrCreate(['nome' => $nome]);
    }
}
