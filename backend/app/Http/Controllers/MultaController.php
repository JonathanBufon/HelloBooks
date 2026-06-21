<?php

namespace App\Http\Controllers;

use App\Http\Requests\Multa\MultaCreateRequest;
use App\Http\Resources\MultaResource;
use App\Services\MultaService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MultaController extends Controller
{
    public function __construct(private readonly MultaService $multas) {}

    public function store(MultaCreateRequest $request): JsonResponse
    {
        $multa = $this->multas->registrar($request->validated());

        return new JsonResponse(
            (new MultaResource($multa))->resolve($request),
            201,
        );
    }

    public function pagar(Request $request, int $id): JsonResponse
    {
        $multa = $this->multas->pagar($id, $request->user()->id_usuario);

        return new JsonResponse((new MultaResource($multa))->resolve($request));
    }

    public function pagarLote(Request $request): JsonResponse
    {
        $request->validate([
            'id_usuario' => ['required', 'integer', 'exists:usuarios,id_usuario'],
        ]);

        $pagas = $this->multas->pagarEmLote(
            (int) $request->input('id_usuario'),
            $request->user()->id_usuario,
        );

        return new JsonResponse(
            collect($pagas)
                ->map(fn ($multa): array => (new MultaResource($multa))->resolve($request))
                ->all(),
        );
    }
}
