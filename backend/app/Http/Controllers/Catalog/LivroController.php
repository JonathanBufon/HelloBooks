<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\LivroCreateRequest;
use App\Http\Requests\Catalog\LivroUpdateRequest;
use App\Http\Resources\Catalog\LivroDetalheResource;
use App\Http\Resources\Catalog\LivroResource;
use App\Services\Catalog\LivroCreateDto;
use App\Services\Catalog\LivroService;
use App\Services\Catalog\LivroUpdateDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LivroController extends Controller
{
    public function __construct(private readonly LivroService $livros) {}

    public function index(Request $request): JsonResponse
    {
        return $this->pagina($request, $this->livros->listar($request->query()));
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse((new LivroDetalheResource($this->livros->detalhe($id)))->resolve($request));
    }

    public function store(LivroCreateRequest $request): JsonResponse
    {
        $livro = $this->livros->criar(LivroCreateDto::fromArray($request->validated()));

        return new JsonResponse($livro, 201);
    }

    public function update(LivroUpdateRequest $request, int $id): JsonResponse
    {
        $livro = $this->livros->atualizar($id, LivroUpdateDto::fromArray($request->validated()));

        return new JsonResponse((new LivroDetalheResource($livro))->resolve($request));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->livros->remover($id);

        return new JsonResponse(null, 204);
    }

    private function pagina(Request $request, LengthAwarePaginator $pagina): JsonResponse
    {
        return new JsonResponse([
            'data' => collect($pagina->items())
                ->map(fn ($livro): array => (new LivroResource($livro))->resolve($request))
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
