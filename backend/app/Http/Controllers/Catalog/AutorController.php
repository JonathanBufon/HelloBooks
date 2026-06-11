<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\AutorUpdateRequest;
use App\Http\Resources\Catalog\AutorResource;
use App\Services\Catalog\AutorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AutorController extends Controller
{
    public function __construct(private readonly AutorService $autores) {}

    public function index(Request $request): JsonResponse
    {
        return $this->pagina($request, $this->autores->listar(
            $request->query('q'),
            max(1, (int) $request->query('page', 1)),
            min(100, max(1, (int) $request->query('per_page', 20))),
        ));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse((new AutorResource($this->autores->detalhe($id)))->resolve($request));
    }

    public function update(AutorUpdateRequest $request, int $id): JsonResponse
    {
        return new JsonResponse((new AutorResource($this->autores->atualizar($id, $request->validated('nome'))))->resolve($request));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->autores->remover($id);

        return new JsonResponse(null, 204);
    }

    private function pagina(Request $request, LengthAwarePaginator $pagina): JsonResponse
    {
        return new JsonResponse([
            'data' => collect($pagina->items())
                ->map(fn ($autor): array => (new AutorResource($autor))->resolve($request))
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
