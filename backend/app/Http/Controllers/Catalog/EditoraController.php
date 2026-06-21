<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\EditoraCreateRequest;
use App\Http\Requests\Catalog\EditoraUpdateRequest;
use App\Http\Resources\Catalog\EditoraResource;
use App\Services\Catalog\EditoraService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EditoraController extends Controller
{
    public function __construct(private readonly EditoraService $editoras) {}

    public function store(EditoraCreateRequest $request): JsonResponse
    {
        $editora = $this->editoras->criar($request->validated('nome'));

        return new JsonResponse((new EditoraResource($editora))->resolve($request), 201);
    }

    public function index(Request $request): JsonResponse
    {
        return $this->pagina($request, $this->editoras->listar(
            $request->query('q'),
            max(1, (int) $request->query('page', 1)),
            min(100, max(1, (int) $request->query('per_page', 20))),
        ));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse((new EditoraResource($this->editoras->detalhe($id)))->resolve($request));
    }

    public function update(EditoraUpdateRequest $request, int $id): JsonResponse
    {
        return new JsonResponse((new EditoraResource($this->editoras->atualizar($id, $request->validated('nome'))))->resolve($request));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->editoras->remover($id);

        return new JsonResponse(null, 204);
    }

    private function pagina(Request $request, LengthAwarePaginator $pagina): JsonResponse
    {
        return new JsonResponse([
            'data' => collect($pagina->items())
                ->map(fn ($editora): array => (new EditoraResource($editora))->resolve($request))
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
