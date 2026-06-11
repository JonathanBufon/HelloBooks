<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\CategoriaUpdateRequest;
use App\Http\Resources\Catalog\CategoriaResource;
use App\Services\Catalog\CategoriaService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function __construct(private readonly CategoriaService $categorias) {}

    public function index(Request $request): JsonResponse
    {
        return $this->pagina($request, $this->categorias->listar(
            $request->query('q'),
            max(1, (int) $request->query('page', 1)),
            min(100, max(1, (int) $request->query('per_page', 20))),
        ));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse((new CategoriaResource($this->categorias->detalhe($id)))->resolve($request));
    }

    public function update(CategoriaUpdateRequest $request, int $id): JsonResponse
    {
        return new JsonResponse((new CategoriaResource($this->categorias->atualizar($id, $request->validated('nome'))))->resolve($request));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->categorias->remover($id);

        return new JsonResponse(null, 204);
    }

    private function pagina(Request $request, LengthAwarePaginator $pagina): JsonResponse
    {
        return new JsonResponse([
            'data' => collect($pagina->items())
                ->map(fn ($categoria): array => (new CategoriaResource($categoria))->resolve($request))
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
