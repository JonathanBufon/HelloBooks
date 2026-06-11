<?php

namespace App\Services\Catalog;

use App\Models\Autor;
use App\Repositories\Catalog\AutorRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AutorService
{
    public function __construct(private readonly AutorRepositoryInterface $autores) {}

    /**
     * @return LengthAwarePaginator<int, Autor>
     */
    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator
    {
        return $this->autores->listar($termo, $page, $perPage);
    }

    public function detalhe(int $id): Autor
    {
        $autor = $this->autores->acharPorId($id);
        abort_if($autor === null, 404, 'Autor nao encontrado.');

        return $autor;
    }

    public function atualizar(int $id, string $nome): Autor
    {
        $autor = $this->detalhe($id);
        $autor->update(['nome' => $nome]);

        return $autor->refresh();
    }
}
