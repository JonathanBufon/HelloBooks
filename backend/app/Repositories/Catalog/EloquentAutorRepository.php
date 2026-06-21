<?php

namespace App\Repositories\Catalog;

use App\Models\Autor;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator
    {
        return Autor::query()
            ->when($termo, fn ($query) => $query->whereRaw(
                'lower(immutable_unaccent(nome)) LIKE lower(immutable_unaccent(?))',
                ['%'.$termo.'%'],
            ))
            ->orderBy('nome')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
