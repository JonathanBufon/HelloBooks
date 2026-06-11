<?php

namespace App\Services\Catalog;

use App\Models\Editora;
use App\Repositories\Catalog\EditoraRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class EditoraService
{
    public function __construct(private readonly EditoraRepositoryInterface $editoras) {}

    /**
     * @return LengthAwarePaginator<int, Editora>
     */
    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator
    {
        return $this->editoras->listar($termo, $page, $perPage);
    }

    public function detalhe(int $id): Editora
    {
        $editora = $this->editoras->acharPorId($id);
        abort_if($editora === null, 404, 'Editora nao encontrada.');

        return $editora;
    }

    public function atualizar(int $id, string $nome): Editora
    {
        $editora = $this->detalhe($id);
        $editora->update(['nome' => $nome]);

        return $editora->refresh();
    }
}
