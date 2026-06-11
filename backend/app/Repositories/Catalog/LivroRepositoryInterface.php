<?php

namespace App\Repositories\Catalog;

use App\Models\Livro;

interface LivroRepositoryInterface
{
    /**
     * @param  array<string, mixed>  $dados
     */
    public function criar(array $dados): Livro;

    public function buscarPorIsbn(string $isbn): ?Livro;

    public function acharPorId(int $id): ?Livro;
}
