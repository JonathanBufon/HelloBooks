<?php

namespace App\Services;

use App\Domain\Exceptions\MultaDuplicadaException;
use App\Domain\Multa\StatusMulta;
use App\Domain\Multa\StatusMultaTransition;
use App\Models\Multa;
use App\Repositories\Emprestimo\ItemEmprestimoRepositoryInterface;
use App\Repositories\Multa\MultaRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MultaService
{
    public function __construct(
        private readonly MultaRepositoryInterface $multas,
        private readonly ItemEmprestimoRepositoryInterface $itensEmprestimo,
    ) {}

    /**
     * @param  array<string, mixed>  $dados
     */
    public function registrar(array $dados): Multa
    {
        return DB::transaction(function () use ($dados): Multa {
            $item = $this->itensEmprestimo->acharPorId((int) $dados['id_item_emprestimo']);
            abort_if($item === null, 404, 'Item de emprestimo nao encontrado.');

            $existente = $this->multas->buscarPorItemEMotivo((int) $dados['id_item_emprestimo'], $dados['motivo']);
            if ($existente !== null) {
                throw new MultaDuplicadaException(details: [
                    'id_item_emprestimo' => $dados['id_item_emprestimo'],
                    'motivo' => $dados['motivo'],
                ]);
            }

            return $this->multas->criar($dados);
        });
    }

    public function pagar(int $id, int $idBibliotecario): Multa
    {
        return DB::transaction(function () use ($id, $idBibliotecario): Multa {
            $multa = $this->detalhar($id);

            StatusMultaTransition::validar($multa->status, StatusMulta::Paga);

            return $this->multas->atualizar($multa, [
                'status' => StatusMulta::Paga,
                'id_bibliotecario_baixa' => $idBibliotecario,
                'data_baixa' => now(),
            ]);
        });
    }

    /**
     * @return array<int, Multa>
     */
    public function pagarEmLote(int $idUsuario, int $idBibliotecario): array
    {
        return DB::transaction(function () use ($idUsuario, $idBibliotecario): array {
            $pendentes = $this->multas->buscarPendentesDoUsuario($idUsuario);
            $pagas = [];

            foreach ($pendentes as $multa) {
                $pagas[] = $this->multas->atualizar($multa, [
                    'status' => StatusMulta::Paga,
                    'id_bibliotecario_baixa' => $idBibliotecario,
                    'data_baixa' => now(),
                ]);
            }

            return $pagas;
        });
    }

    public function perdoar(int $id, string $justificativa, int $idBibliotecario): Multa
    {
        return DB::transaction(function () use ($id, $justificativa, $idBibliotecario): Multa {
            $multa = $this->detalhar($id);

            StatusMultaTransition::validar($multa->status, StatusMulta::Perdoada);

            return $this->multas->atualizar($multa, [
                'status' => StatusMulta::Perdoada,
                'justificativa_perdao' => $justificativa,
                'id_bibliotecario_baixa' => $idBibliotecario,
                'data_baixa' => now(),
            ]);
        });
    }

    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listar(array $filtros): LengthAwarePaginator
    {
        return $this->multas->listarPaginado($filtros);
    }

    public function detalhar(int $id): Multa
    {
        $multa = $this->multas->acharPorId($id);
        abort_if($multa === null, 404, 'Multa nao encontrada.');

        return $multa;
    }

    /**
     * @param  array<string, mixed>  $filtros
     */
    public function listarDoUsuario(int $idUsuario, array $filtros = []): LengthAwarePaginator
    {
        $filtros['id_usuario'] = $idUsuario;

        return $this->multas->listarPaginado($filtros);
    }

    /**
     * @return array{quantidade_pendente: int, valor_total_pendente: string}
     */
    public function resumoDoUsuario(int $idUsuario): array
    {
        return $this->multas->resumoPendentesDoUsuario($idUsuario);
    }

    public function temMultasPendentes(int $idUsuario): bool
    {
        $resumo = $this->resumoDoUsuario($idUsuario);

        return $resumo['quantidade_pendente'] > 0;
    }
}
