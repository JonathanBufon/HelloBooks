<?php

use App\Http\Controllers\Catalog\AutorController;
use App\Http\Controllers\Catalog\CategoriaController;
use App\Http\Controllers\Catalog\EditoraController;
use App\Http\Controllers\Catalog\ExemplarController;
use App\Http\Controllers\Catalog\LivroController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['auth:api', 'cargo:bibliotecario'])
    ->group(function (): void {
        Route::get('/livros', [LivroController::class, 'index']);
        Route::post('/livros', [LivroController::class, 'store']);
        Route::get('/livros/{id}', [LivroController::class, 'show'])->whereNumber('id');
        Route::put('/livros/{id}', [LivroController::class, 'update'])->whereNumber('id');
        Route::delete('/livros/{id}', [LivroController::class, 'destroy'])->whereNumber('id');
        Route::get('/livros/{id}/exemplares', [ExemplarController::class, 'indexPorLivro'])->whereNumber('id');
        Route::post('/livros/{id}/exemplares', [ExemplarController::class, 'storeBatch'])->whereNumber('id');
        Route::get('/exemplares/{id}', [ExemplarController::class, 'show'])->whereNumber('id');
        Route::put('/exemplares/{id}', [ExemplarController::class, 'update'])->whereNumber('id');
        Route::delete('/exemplares/{id}', [ExemplarController::class, 'destroy'])->whereNumber('id');

        Route::get('/autores', [AutorController::class, 'index']);
        Route::get('/autores/{id}', [AutorController::class, 'show'])->whereNumber('id');
        Route::put('/autores/{id}', [AutorController::class, 'update'])->whereNumber('id');
        Route::delete('/autores/{id}', [AutorController::class, 'destroy'])->whereNumber('id');
        Route::get('/editoras', [EditoraController::class, 'index']);
        Route::get('/editoras/{id}', [EditoraController::class, 'show'])->whereNumber('id');
        Route::put('/editoras/{id}', [EditoraController::class, 'update'])->whereNumber('id');
        Route::delete('/editoras/{id}', [EditoraController::class, 'destroy'])->whereNumber('id');
        Route::get('/categorias', [CategoriaController::class, 'index']);
        Route::get('/categorias/{id}', [CategoriaController::class, 'show'])->whereNumber('id');
        Route::put('/categorias/{id}', [CategoriaController::class, 'update'])->whereNumber('id');
        Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy'])->whereNumber('id');
    });
