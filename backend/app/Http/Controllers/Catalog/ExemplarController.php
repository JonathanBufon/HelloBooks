<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\ExemplarBatchRequest;
use App\Services\Catalog\ExemplarService;
use Illuminate\Http\JsonResponse;

class ExemplarController extends Controller
{
    public function __construct(private readonly ExemplarService $exemplares) {}

    public function storeBatch(ExemplarBatchRequest $request, int $id): JsonResponse
    {
        $exemplares = $this->exemplares->registrarLote($id, (int) $request->validated('quantidade'));

        return new JsonResponse($exemplares, 201);
    }
}
