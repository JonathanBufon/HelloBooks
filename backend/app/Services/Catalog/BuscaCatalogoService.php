<?php

namespace App\Services\Catalog;

use App\Models\Livro;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class BuscaCatalogoService
{
    /**
     * @return LengthAwarePaginator<int, Livro>
     */
    public function buscar(?string $termo, int $page, int $perPage): LengthAwarePaginator
    {
        $termo = trim((string) $termo);

        return Livro::query()
            ->with(['editora', 'autores', 'categorias'])
            ->when($termo !== '', function ($query) use ($termo): void {
                $pattern = '%'.$termo.'%';

                $query->where(function ($query) use ($pattern): void {
                    $query->whereRaw('lower(immutable_unaccent(titulo)) LIKE lower(immutable_unaccent(?))', [$pattern])
                        ->orWhereRaw('lower(isbn) LIKE lower(?)', [$pattern])
                        ->orWhereHas('autores', fn ($query) => $query->whereRaw(
                            'lower(immutable_unaccent(autores.nome)) LIKE lower(immutable_unaccent(?))',
                            [$pattern],
                        ))
                        ->orWhereHas('categorias', fn ($query) => $query->whereRaw(
                            'lower(immutable_unaccent(categorias.nome)) LIKE lower(immutable_unaccent(?))',
                            [$pattern],
                        ));
                });
            })
            ->orderBy('titulo')
            ->paginate($perPage, ['*'], 'page', $page);
    }
}
