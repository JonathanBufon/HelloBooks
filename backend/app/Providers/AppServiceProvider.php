<?php

namespace App\Providers;

use App\Repositories\Catalog\AutorRepositoryInterface;
use App\Repositories\Catalog\CategoriaRepositoryInterface;
use App\Repositories\Catalog\EditoraRepositoryInterface;
use App\Repositories\Catalog\EloquentAutorRepository;
use App\Repositories\Catalog\EloquentCategoriaRepository;
use App\Repositories\Catalog\EloquentEditoraRepository;
use App\Repositories\Catalog\EloquentExemplarRepository;
use App\Repositories\Catalog\EloquentLivroRepository;
use App\Repositories\Catalog\ExemplarRepositoryInterface;
use App\Repositories\Catalog\LivroRepositoryInterface;
use App\Repositories\EloquentLogRepository;
use App\Repositories\EloquentUsuarioRepository;
use App\Repositories\Emprestimo\EloquentItemEmprestimoRepository;
use App\Repositories\Emprestimo\ItemEmprestimoRepositoryInterface;
use App\Repositories\LogRepositoryInterface;
use App\Repositories\Multa\EloquentMultaRepository;
use App\Repositories\Multa\MultaRepositoryInterface;
use App\Repositories\UsuarioRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(LivroRepositoryInterface::class, EloquentLivroRepository::class);
        $this->app->bind(AutorRepositoryInterface::class, EloquentAutorRepository::class);
        $this->app->bind(EditoraRepositoryInterface::class, EloquentEditoraRepository::class);
        $this->app->bind(CategoriaRepositoryInterface::class, EloquentCategoriaRepository::class);
        $this->app->bind(ExemplarRepositoryInterface::class, EloquentExemplarRepository::class);
        $this->app->bind(UsuarioRepositoryInterface::class, EloquentUsuarioRepository::class);
        $this->app->bind(LogRepositoryInterface::class, EloquentLogRepository::class);
        $this->app->bind(MultaRepositoryInterface::class, EloquentMultaRepository::class);
        $this->app->bind(ItemEmprestimoRepositoryInterface::class, EloquentItemEmprestimoRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
