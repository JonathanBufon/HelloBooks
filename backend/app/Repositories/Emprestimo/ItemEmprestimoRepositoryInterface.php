<?php

namespace App\Repositories\Emprestimo;

use App\Models\ItemEmprestimo;

interface ItemEmprestimoRepositoryInterface
{
    public function acharPorId(int $id): ?ItemEmprestimo;
}
