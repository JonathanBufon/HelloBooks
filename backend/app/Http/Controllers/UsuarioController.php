<?php

namespace App\Http\Controllers;

use App\Http\Requests\Usuario\UsuarioCreateRequest;
use App\Http\Requests\Usuario\UsuarioIndexRequest;
use App\Http\Requests\Usuario\UsuarioUpdateRequest;
use App\Http\Resources\UsuarioResource;
use App\Services\UsuarioService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    public function __construct(private readonly UsuarioService $usuarios) {}

    public function index(UsuarioIndexRequest $request): JsonResponse
    {
        return $this->pagina($request, $this->usuarios->listar($request->validated()));
    }

    public function store(UsuarioCreateRequest $request): JsonResponse
    {
        $usuario = $this->usuarios->criar($request->validated());

        return new JsonResponse((new UsuarioResource($usuario))->resolve($request), 201);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        return new JsonResponse((new UsuarioResource($this->usuarios->detalhe($id)))->resolve($request));
    }

    public function update(UsuarioUpdateRequest $request, int $id): JsonResponse
    {
        return new JsonResponse((new UsuarioResource($this->usuarios->atualizar($id, $request->validated())))->resolve($request));
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->usuarios->remover($id, (int) $request->user()->getAuthIdentifier());

        return new JsonResponse(null, 204);
    }

    private function pagina(Request $request, LengthAwarePaginator $pagina): JsonResponse
    {
        return new JsonResponse([
            'data' => collect($pagina->items())
                ->map(fn ($usuario): array => (new UsuarioResource($usuario))->resolve($request))
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
