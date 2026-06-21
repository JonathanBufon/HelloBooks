<?php

namespace App\Http\Controllers;

use App\Http\Resources\MultaResumoResource;
use App\Services\MultaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MinhasMultasController extends Controller
{
    public function __construct(private readonly MultaService $multas) {}

    public function resumo(Request $request): JsonResponse
    {
        $resumo = $this->multas->resumoDoUsuario($request->user()->id_usuario);

        return new JsonResponse((new MultaResumoResource($resumo))->resolve($request));
    }
}
