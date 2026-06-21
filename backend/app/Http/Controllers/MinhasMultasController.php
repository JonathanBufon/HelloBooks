<?php

namespace App\Http\Controllers;

use App\Domain\Multa\StatusMulta;
use App\Http\Resources\MultaResource;
use App\Http\Resources\MultaResumoResource;
use App\Services\MultaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MinhasMultasController extends Controller
{
    public function __construct(private readonly MultaService $multas) {}

    public function resumo(Request $request): JsonResponse
    {
        $resumo = $this->multas->resumoDoUsuario($request->user()->id_usuario);

        return new JsonResponse((new MultaResumoResource($resumo))->resolve($request));
    }

    public function index(Request $request): JsonResponse
    {
        $filtros = $request->validate([
            'status' => ['sometimes', 'string', Rule::enum(StatusMulta::class)],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
        ]);
        $idUsuario = $request->user()->id_usuario;
        $paginator = $this->multas->listarDoUsuario($idUsuario, $filtros);
        $resumo = $this->multas->resumoDoUsuario($idUsuario);

        return new JsonResponse([
            'data' => MultaResource::collection($paginator->items())->resolve($request),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
            'resumo' => (new MultaResumoResource($resumo))->resolve($request),
        ]);
    }
}
