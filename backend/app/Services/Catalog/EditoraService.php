<?php

namespace App\Services\Catalog;

use App\Domain\Exceptions\RecursoEmUsoException;
use App\Models\Editora;
use App\Repositories\Catalog\EditoraRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;

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

    public function remover(int $id): void
    {
        $editora = $this->detalhe($id);
        $totalLivros = $editora->livros()->count();

        if ($totalLivros > 0) {
            throw new RecursoEmUsoException(
                'Editora ainda esta associada a livros.',
                ['livros' => $totalLivros],
                'EDITORA_REFERENCIADA',
            );
        }

        try {
            $editora->delete();
        } catch (QueryException $exception) {
            if ($exception->getCode() === '23503') {
                throw new RecursoEmUsoException('Editora ainda esta associada a livros.', ['livros' => $totalLivros], 'EDITORA_REFERENCIADA', $exception);
            }

            throw $exception;
        }
    }
}
