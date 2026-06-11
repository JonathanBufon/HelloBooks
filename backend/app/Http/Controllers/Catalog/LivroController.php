<?php

namespace App\Http\Controllers\Catalog;

use App\Http\Controllers\Controller;
use App\Http\Requests\Catalog\LivroCreateRequest;
use App\Services\Catalog\LivroCreateDto;
use App\Services\Catalog\LivroService;
use Illuminate\Http\JsonResponse;

class LivroController extends Controller
{
    public function __construct(private readonly LivroService $livros) {}

    public function store(LivroCreateRequest $request): JsonResponse
    {
        $livro = $this->livros->criar(LivroCreateDto::fromArray($request->validated()));

        return new JsonResponse($livro, 201);
    }
}
