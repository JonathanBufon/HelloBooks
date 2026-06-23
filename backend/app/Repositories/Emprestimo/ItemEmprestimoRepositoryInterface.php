<?php

namespace App\Repositories\Emprestimo;

use App\Models\ItemEmprestimo;
use Illuminate\Database\Eloquent\Collection;

interface ItemEmprestimoRepositoryInterface
{
    public function acharPorId(int $id): ?ItemEmprestimo;

    /**
     * @return Collection<int, ItemEmprestimo>
     */
    public function listarPorUsuario(int $idUsuario): Collection;
}
