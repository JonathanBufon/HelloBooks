<?php

namespace App\Http\Controllers;

use App\Http\Requests\Multa\MultaCreateRequest;
use App\Http\Requests\Multa\MultaIndexRequest;
use App\Http\Requests\Multa\MultaPerdoarRequest;
use App\Http\Resources\MultaDetalheResource;
use App\Http\Resources\MultaResource;
use App\Services\MultaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MultaController extends Controller
{
    public function __construct(private readonly MultaService $multas) {}

    public function index(MultaIndexRequest $request): JsonResponse
    {
        $paginator = $this->multas->listar($request->validated());

        return new JsonResponse([
            'data' => MultaResource::collection($paginator->items())->resolve($request),
            'pagination' => [
                'total' => $paginator->total(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
            ],
        ]);
    }

    public function show(Request $request, int $id): JsonResponse
    {
        $multa = $this->multas->detalhar($id);

        return new JsonResponse((new MultaDetalheResource($multa))->resolve($request));
    }

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

    public function perdoar(MultaPerdoarRequest $request, int $id): JsonResponse
    {
        $multa = $this->multas->perdoar(
            $id,
            $request->validated('justificativa'),
            $request->user()->id_usuario,
        );

        return new JsonResponse((new MultaResource($multa))->resolve($request));
    }
}
