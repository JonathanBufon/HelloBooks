<?php

namespace App\Services\Catalog;

use App\Domain\Exceptions\DomainException;
use App\Models\Categoria;
use App\Repositories\Catalog\CategoriaRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;

class CategoriaService
{
    public function __construct(private readonly CategoriaRepositoryInterface $categorias) {}

    /**
     * @return LengthAwarePaginator<int, Categoria>
     */
    public function listar(?string $termo, int $page, int $perPage): LengthAwarePaginator
    {
        return $this->categorias->listar($termo, $page, $perPage);
    }

    public function detalhe(int $id): Categoria
    {
        $categoria = $this->categorias->acharPorId($id);
        abort_if($categoria === null, 404, 'Categoria nao encontrada.');

        return $categoria;
    }

    public function atualizar(int $id, string $nome): Categoria
    {
        $categoria = $this->detalhe($id);

        try {
            $categoria->update(['nome' => $nome]);
        } catch (QueryException $exception) {
            if ($exception->getCode() === '23505') {
                throw new DomainException('CATEGORIA_DUPLICADA', 'Categoria ja cadastrada.', ['nome' => $nome], previous: $exception);
            }

            throw $exception;
        }

        return $categoria->refresh();
    }
}
