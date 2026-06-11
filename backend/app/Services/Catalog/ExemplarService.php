<?php

namespace App\Services\Catalog;

use App\Models\Exemplar;
use App\Models\Livro;
use App\Repositories\Catalog\ExemplarRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ExemplarService
{
    public function __construct(private readonly ExemplarRepositoryInterface $exemplares) {}

    /**
     * @return Collection<int, Exemplar>
     */
    public function registrarLote(int $idLivro, int $quantidade): Collection
    {
        return DB::transaction(function () use ($idLivro, $quantidade): Collection {
            abort_if(Livro::query()->whereKey($idLivro)->doesntExist(), 404, 'Livro nao encontrado.');

            return $this->exemplares->criarEmLote($idLivro, $quantidade);
        });
    }
}
