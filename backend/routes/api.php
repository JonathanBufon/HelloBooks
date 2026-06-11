<?php

use App\Http\Controllers\Catalog\ExemplarController;
use App\Http\Controllers\Catalog\LivroController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['auth:api', 'cargo:bibliotecario'])
    ->group(function (): void {
        Route::post('/livros', [LivroController::class, 'store']);
        Route::post('/livros/{id}/exemplares', [ExemplarController::class, 'storeBatch'])->whereNumber('id');
    });
