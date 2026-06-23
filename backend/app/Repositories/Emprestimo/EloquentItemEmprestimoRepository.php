<?php

namespace App\Repositories\Emprestimo;

use App\Models\ItemEmprestimo;
use Illuminate\Database\Eloquent\Collection;

class EloquentItemEmprestimoRepository implements ItemEmprestimoRepositoryInterface
{
    public function acharPorId(int $id): ?ItemEmprestimo
    {
        return ItemEmprestimo::query()
            ->with(['emprestimo.usuario', 'exemplar.livro'])
            ->find($id);
    }

    /**
     * @return Collection<int, ItemEmprestimo>
     */
    public function listarPorUsuario(int $idUsuario): Collection
    {
        return ItemEmprestimo::query()
            ->with(['emprestimo', 'exemplar.livro'])
            ->whereHas('emprestimo', fn ($query) => $query->where('id_usuario', $idUsuario))
            ->orderByDesc('id_item_emprestimo')
            ->get();
    }
}
