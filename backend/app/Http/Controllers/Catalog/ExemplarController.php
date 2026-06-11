<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\ExemplarBatchRequest;
use App\Http\Requests\Catalog\ExemplarUpdateRequest;
use App\Http\Resources\Catalog\ExemplarResource;
use App\Services\Catalog\ExemplarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExemplarController extends Controller
{
    public function __construct(private readonly ExemplarService $exemplares) {}

    public function indexPorLivro(Request $request, int $id): JsonResponse
    {
        return new JsonResponse($this->exemplares->listarPorLivro($id)
            ->map(fn ($exemplar): array => (new ExemplarResource($exemplar))->resolve($request))
            ->all());
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse((new ExemplarResource($this->exemplares->detalhe($id)))->resolve($request));
    }

    public function storeBatch(ExemplarBatchRequest $request, int $id): JsonResponse
    {
        $exemplares = $this->exemplares->registrarLote($id, (int) $request->validated('quantidade'));

        return new JsonResponse($exemplares, 201);
    }

    public function update(ExemplarUpdateRequest $request, int $id): JsonResponse
    {
        $exemplar = $this->exemplares->atualizar($id, $request->validated());

        return new JsonResponse((new ExemplarResource($exemplar))->resolve($request));
    }
}
