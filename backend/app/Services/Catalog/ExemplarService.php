<?php

namespace App\Services\Catalog;

use App\Domain\Exemplar\CondicaoFisica;
use App\Domain\Exemplar\StatusExemplar;
use App\Domain\Exemplar\StatusTransition;
use App\Models\Exemplar;
use App\Models\Livro;
use App\Repositories\Catalog\ExemplarRepositoryInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ExemplarService
{
    public function __construct(private readonly ExemplarRepositoryInterface $exemplares) {}

    /**
     * @return Collection<int, Exemplar>
     */
    public function registrarLote(int $idLivro, int $quantidade): Collection
    {
        return DB::transaction(function () use ($idLivro, $quantidade): Collection {
            abort_if(Livro::query()->whereKey($idLivro)->doesntExist(), 404, 'Livro nao encontrado.');

            return $this->exemplares->criarEmLote($idLivro, $quantidade);
        });
    }

    /**
     * @return Collection<int, Exemplar>
     */
    public function listarPorLivro(int $idLivro): Collection
    {
        abort_if(Livro::query()->whereKey($idLivro)->doesntExist(), 404, 'Livro nao encontrado.');

        return $this->exemplares->listarPorLivro($idLivro);
    }

    public function detalhe(int $id): Exemplar
    {
        $exemplar = $this->exemplares->acharPorId($id);
        abort_if($exemplar === null, 404, 'Exemplar nao encontrado.');

        return $exemplar;
    }

    /**
     * @param  array<string, mixed>  $dados
     */
    public function atualizar(int $id, array $dados): Exemplar
    {
        $exemplar = $this->detalhe($id);

        if (isset($dados['status'])) {
            $novoStatus = StatusExemplar::from($dados['status']);
            StatusTransition::validarCatalogo($exemplar->status, $novoStatus);
            $exemplar->status = $novoStatus;
        }

        if (isset($dados['condicao_fisica'])) {
            $exemplar->condicao_fisica = CondicaoFisica::from($dados['condicao_fisica']);
        }

        $exemplar->save();

        return $exemplar->refresh();
    }
}
