<?php

namespace App\Repositories\Emprestimo;

use App\Models\ItemEmprestimo;

class EloquentItemEmprestimoRepository implements ItemEmprestimoRepositoryInterface
{
    public function acharPorId(int $id): ?ItemEmprestimo
    {
        return ItemEmprestimo::query()
            ->with(['emprestimo.usuario', 'exemplar.livro'])
            ->find($id);
    }
}
