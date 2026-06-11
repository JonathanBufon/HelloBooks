<?php

namespace App\Repositories\Catalog;

use App\Models\Categoria;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator
    {
        return Categoria::query()
            ->when($termo, fn ($query) => $query->whereRaw(
                'lower(immutable_unaccent(nome)) LIKE lower(immutable_unaccent(?))',
                ['%'.$termo.'%'],
            ))
            ->orderBy('nome')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
