<?php

namespace App\Repositories\Catalog;

use App\Models\Editora;

interface EditoraRepositoryInterface
{
    public function criar(string $nome): Editora;

    public function acharPorId(int $id): ?Editora;

    public function acharOuCriarPorNome(string $nome): Editora;
}
