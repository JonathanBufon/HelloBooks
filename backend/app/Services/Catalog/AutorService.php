<?php

namespace App\Services\Catalog;

use App\Domain\Exceptions\RecursoEmUsoException;
use App\Models\Autor;
use App\Repositories\Catalog\AutorRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;

class AutorService
{
    public function __construct(private readonly AutorRepositoryInterface $autores) {}

    public function criar(string $nome): Autor
    {
        return $this->autores->criar($nome);
    }

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

    public function remover(int $id): void
    {
        $autor = $this->detalhe($id);
        $totalLivros = $autor->livros()->count();

        if ($totalLivros > 0) {
            throw new RecursoEmUsoException(
                'Autor ainda esta associado a livros.',
                ['livros' => $totalLivros],
                'AUTOR_REFERENCIADO',
            );
        }

        try {
            $autor->delete();
        } catch (QueryException $exception) {
            if ($exception->getCode() === '23503') {
                throw new RecursoEmUsoException('Autor ainda esta associado a livros.', ['livros' => $totalLivros], 'AUTOR_REFERENCIADO', $exception);
            }

            throw $exception;
        }
    }
}
