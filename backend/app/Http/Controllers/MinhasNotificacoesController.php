<?php

namespace App\Http\Controllers;

use App\Http\Resources\MultaResource;
use App\Http\Resources\MultaResumoResource;
use App\Services\MultaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MinhasNotificacoesController extends Controller
{
    public function __construct(private readonly MultaService $multas) {}

    public function index(Request $request): JsonResponse
    {
        return new JsonResponse(
            MultaResource::collection($this->multas->listarNotificacoesNaoLidas($request->user()->id_usuario))->resolve($request),
        );
    }

    public function resumo(Request $request): JsonResponse
    {
        return new JsonResponse((new MultaResumoResource($this->multas->resumoNotificacoesNaoLidas($request->user()->id_usuario)))->resolve($request));
    }

    public function marcarLidas(Request $request): JsonResponse
    {
        $this->multas->marcarNotificacoesComoLidas($request->user()->id_usuario);

        return new JsonResponse(['message' => 'Notificacoes marcadas como lidas.']);
    }
}
