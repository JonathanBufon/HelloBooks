<?php

namespace App\Http\Controllers;

use App\Http\Requests\SolicitacaoEmprestimo\SolicitacaoEmprestimoIndexRequest;
use App\Http\Requests\SolicitacaoEmprestimo\SolicitacaoEmprestimoRecusarRequest;
use App\Http\Resources\SolicitacaoEmprestimoResource;
use App\Services\SolicitacaoEmprestimoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SolicitacaoEmprestimoController extends Controller
{
    public function __construct(private readonly SolicitacaoEmprestimoService $solicitacoes) {}

    public function index(SolicitacaoEmprestimoIndexRequest $request): JsonResponse
    {
        $paginator = $this->solicitacoes->listar($request->validated());

        return new JsonResponse([
            'data' => SolicitacaoEmprestimoResource::collection($paginator->items())->resolve($request),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function aprovar(Request $request, int $id): JsonResponse
    {
        $solicitacao = $this->solicitacoes->aprovar($id, $request->user()->id_usuario);

        return new JsonResponse((new SolicitacaoEmprestimoResource($solicitacao))->resolve($request));
    }

    public function recusar(SolicitacaoEmprestimoRecusarRequest $request, int $id): JsonResponse
    {
        $solicitacao = $this->solicitacoes->recusar(
            $id,
            $request->validated('justificativa'),
            $request->user()->id_usuario,
        );

        return new JsonResponse((new SolicitacaoEmprestimoResource($solicitacao))->resolve($request));
    }
}
