<?php

namespace App\Http\Controllers;

use App\Http\Requests\Log\LogIndexRequest;
use App\Http\Resources\LogAtividadeResource;
use App\Repositories\LogRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LogController extends Controller
{
    public function __construct(private readonly LogRepositoryInterface $logs) {}

    public function index(LogIndexRequest $request): JsonResponse
    {
        return $this->pagina($request, $this->logs->listar($request->validated()));
    }

    private function pagina(Request $request, LengthAwarePaginator $pagina): JsonResponse
    {
        return new JsonResponse([
            'data' => collect($pagina->items())
                ->map(fn ($log): array => (new LogAtividadeResource($log))->resolve($request))
                ->all(),
            'pagination' => [
                'total' => $pagina->total(),
                'per_page' => $pagina->perPage(),
                'current_page' => $pagina->currentPage(),
                'last_page' => $pagina->lastPage(),
            ],
        ]);
    }
}
