<?php

namespace App\Repositories\Catalog;

use App\Models\Livro;

class EloquentLivroRepository implements LivroRepositoryInterface
{
    public function criar(array $dados): Livro
    {
        return Livro::query()->create($dados);
    }

    public function buscarPorIsbn(string $isbn): ?Livro
    {
        return Livro::query()->where('isbn', $isbn)->first();
    }

    public function acharPorId(int $id): ?Livro
    {
        return Livro::query()->find($id);
    }
}
