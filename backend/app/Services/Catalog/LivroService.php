<?php

namespace App\Services\Catalog;

use App\Domain\Exceptions\IsbnDuplicadoException;
use App\Models\Livro;
use App\Repositories\Catalog\AutorRepositoryInterface;
use App\Repositories\Catalog\CategoriaRepositoryInterface;
use App\Repositories\Catalog\EditoraRepositoryInterface;
use App\Repositories\Catalog\LivroRepositoryInterface;
use Illuminate\Support\Facades\DB;

class LivroService
{
    public function __construct(
        private readonly LivroRepositoryInterface $livros,
        private readonly EditoraRepositoryInterface $editoras,
        private readonly AutorRepositoryInterface $autores,
        private readonly CategoriaRepositoryInterface $categorias,
    ) {}

    public function criar(LivroCreateDto $dto): Livro
    {
        return DB::transaction(function () use ($dto): Livro {
            if ($this->livros->buscarPorIsbn($dto->isbn) !== null) {
                throw new IsbnDuplicadoException(details: ['isbn' => $dto->isbn]);
            }

            $editora = $dto->idEditora !== null
                ? $this->editoras->acharPorId($dto->idEditora)
                : $this->editoras->acharOuCriarPorNome($dto->editora['nome'] ?? '');

            abort_if($editora === null, 422, 'Editora informada nao existe.');

            $livro = $this->livros->criar([
                'id_editora' => $editora->id_editora,
                'titulo' => $dto->titulo,
                'isbn' => $dto->isbn,
                'ano_publicacao' => $dto->anoPublicacao,
            ]);

            $autorIds = collect($dto->autores)
                ->map(fn (array $autor): int => isset($autor['id_autor'])
                    ? (int) $autor['id_autor']
                    : $this->autores->acharOuCriarPorNome($autor['nome'])->id_autor)
                ->all();

            $categoriaIds = collect($dto->categorias)
                ->map(fn (array $categoria): int => isset($categoria['id_categoria'])
                    ? (int) $categoria['id_categoria']
                    : $this->categorias->acharOuCriarPorNome($categoria['nome'])->id_categoria)
                ->all();

            $livro->autores()->sync($autorIds);
            $livro->categorias()->sync($categoriaIds);

            return $livro->load(['editora', 'autores', 'categorias']);
        });
    }
}
