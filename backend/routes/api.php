<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Catalog\AutorController;
use App\Http\Controllers\Catalog\CategoriaController;
use App\Http\Controllers\Catalog\EditoraController;
use App\Http\Controllers\Catalog\ExemplarController;
use App\Http\Controllers\Catalog\LivroController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LogController;
use App\Http\Controllers\MinhasMultasController;
use App\Http\Controllers\MinhasSolicitacoesEmprestimoController;
use App\Http\Controllers\MultaController;
use App\Http\Controllers\SolicitacaoEmprestimoController;
use App\Http\Controllers\UsuarioController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->group(function (): void {
        Route::post('/auth/login', [AuthController::class, 'login']);

        Route::middleware('auth:api')->group(function (): void {
            Route::post('/auth/logout', [AuthController::class, 'logout']);
            Route::post('/auth/refresh', [AuthController::class, 'refresh']);
            Route::get('/auth/me', [AuthController::class, 'me']);

            Route::get('/livros', [LivroController::class, 'index']);
            Route::get('/livros/{id}', [LivroController::class, 'show'])->whereNumber('id');
            Route::get('/categorias', [CategoriaController::class, 'index']);

            Route::get('/minhas-multas', [MinhasMultasController::class, 'index']);
            Route::get('/minhas-multas/resumo', [MinhasMultasController::class, 'resumo']);
            Route::get('/minhas-solicitacoes-emprestimo', [MinhasSolicitacoesEmprestimoController::class, 'index']);
            Route::post('/minhas-solicitacoes-emprestimo', [MinhasSolicitacoesEmprestimoController::class, 'store']);
            Route::put('/minhas-solicitacoes-emprestimo/{id}/cancelar', [MinhasSolicitacoesEmprestimoController::class, 'cancelar'])->whereNumber('id');
        });
    });

Route::prefix('v1')
    ->middleware(['auth:api', 'cargo:bibliotecario'])
    ->group(function (): void {
        Route::post('/livros', [LivroController::class, 'store']);
        Route::put('/livros/{id}', [LivroController::class, 'update'])->whereNumber('id');
        Route::delete('/livros/{id}', [LivroController::class, 'destroy'])->whereNumber('id');
        Route::get('/livros/{id}/exemplares', [ExemplarController::class, 'indexPorLivro'])->whereNumber('id');
        Route::post('/livros/{id}/exemplares', [ExemplarController::class, 'storeBatch'])->whereNumber('id');
        Route::get('/exemplares/{id}', [ExemplarController::class, 'show'])->whereNumber('id');
        Route::put('/exemplares/{id}', [ExemplarController::class, 'update'])->whereNumber('id');
        Route::delete('/exemplares/{id}', [ExemplarController::class, 'destroy'])->whereNumber('id');

        Route::get('/autores', [AutorController::class, 'index']);
        Route::post('/autores', [AutorController::class, 'store']);
        Route::get('/autores/{id}', [AutorController::class, 'show'])->whereNumber('id');
        Route::put('/autores/{id}', [AutorController::class, 'update'])->whereNumber('id');
        Route::delete('/autores/{id}', [AutorController::class, 'destroy'])->whereNumber('id');
        Route::get('/editoras', [EditoraController::class, 'index']);
        Route::post('/editoras', [EditoraController::class, 'store']);
        Route::get('/editoras/{id}', [EditoraController::class, 'show'])->whereNumber('id');
        Route::put('/editoras/{id}', [EditoraController::class, 'update'])->whereNumber('id');
        Route::delete('/editoras/{id}', [EditoraController::class, 'destroy'])->whereNumber('id');
        Route::post('/categorias', [CategoriaController::class, 'store']);
        Route::get('/categorias/{id}', [CategoriaController::class, 'show'])->whereNumber('id');
        Route::put('/categorias/{id}', [CategoriaController::class, 'update'])->whereNumber('id');
        Route::delete('/categorias/{id}', [CategoriaController::class, 'destroy'])->whereNumber('id');

        Route::get('/usuarios', [UsuarioController::class, 'index']);
        Route::post('/usuarios', [UsuarioController::class, 'store']);
        Route::get('/usuarios/{id}', [UsuarioController::class, 'show'])->whereNumber('id');
        Route::put('/usuarios/{id}', [UsuarioController::class, 'update'])->whereNumber('id');
        Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy'])->whereNumber('id');

        Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
        Route::get('/logs', [LogController::class, 'index']);

        Route::get('/multas', [MultaController::class, 'index']);
        Route::get('/multas/{id}', [MultaController::class, 'show'])->whereNumber('id');
        Route::post('/multas', [MultaController::class, 'store']);
        Route::put('/multas/pagar-lote', [MultaController::class, 'pagarLote']);
        Route::put('/multas/{id}/pagar', [MultaController::class, 'pagar'])->whereNumber('id');
        Route::put('/multas/{id}/perdoar', [MultaController::class, 'perdoar'])->whereNumber('id');

        Route::get('/solicitacoes-emprestimo', [SolicitacaoEmprestimoController::class, 'index']);
        Route::put('/solicitacoes-emprestimo/{id}/aprovar', [SolicitacaoEmprestimoController::class, 'aprovar'])->whereNumber('id');
        Route::put('/solicitacoes-emprestimo/{id}/recusar', [SolicitacaoEmprestimoController::class, 'recusar'])->whereNumber('id');
    });
