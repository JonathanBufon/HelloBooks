<?php

namespace App\Repositories\Catalog;

use App\Models\Exemplar;
use Illuminate\Support\Collection;

class EloquentExemplarRepository implements ExemplarRepositoryInterface
{
    public function criarEmLote(int $idLivro, int $quantidade): Collection
    {
        return collect(range(1, $quantidade))->map(fn (): Exemplar => Exemplar::query()->create([
            'id_livro' => $idLivro,
        ]));
    }
}
