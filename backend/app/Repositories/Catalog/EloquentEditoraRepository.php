<?php

namespace App\Repositories\Catalog;

use App\Models\Editora;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator
    {
        return Editora::query()
            ->when($termo, fn ($query) => $query->whereRaw(
                'lower(immutable_unaccent(nome)) LIKE lower(immutable_unaccent(?))',
                ['%'.$termo.'%'],
            ))
            ->orderBy('nome')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
