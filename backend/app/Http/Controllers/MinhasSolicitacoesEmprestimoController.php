<?php

namespace App\Http\Controllers;

use App\Http\Requests\SolicitacaoEmprestimo\SolicitacaoEmprestimoCreateRequest;
use App\Http\Requests\SolicitacaoEmprestimo\SolicitacaoEmprestimoIndexRequest;
use App\Http\Resources\SolicitacaoEmprestimoResource;
use App\Services\SolicitacaoEmprestimoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MinhasSolicitacoesEmprestimoController extends Controller
{
    public function __construct(private readonly SolicitacaoEmprestimoService $solicitacoes) {}

    public function index(SolicitacaoEmprestimoIndexRequest $request): JsonResponse
    {
        $paginator = $this->solicitacoes->listarDoUsuario($request->user()->id_usuario, $request->validated());

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

    public function store(SolicitacaoEmprestimoCreateRequest $request): JsonResponse
    {
        $solicitacao = $this->solicitacoes->criar(
            $request->user()->id_usuario,
            (int) $request->validated('id_livro'),
            $request->validated('observacoes'),
        );

        return new JsonResponse((new SolicitacaoEmprestimoResource($solicitacao))->resolve($request), 201);
    }

    public function cancelar(Request $request, int $id): JsonResponse
    {
        $solicitacao = $this->solicitacoes->cancelarDoUsuario($id, $request->user()->id_usuario);

        return new JsonResponse((new SolicitacaoEmprestimoResource($solicitacao))->resolve($request));
    }
}
