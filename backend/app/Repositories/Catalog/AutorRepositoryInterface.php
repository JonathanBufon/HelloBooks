<?php

namespace App\Repositories\Catalog;

use App\Models\Autor;

interface AutorRepositoryInterface
{
    public function criar(string $nome): Autor;

    public function acharOuCriarPorNome(string $nome): Autor;

    public function acharPorId(int $id): ?Autor;
}
