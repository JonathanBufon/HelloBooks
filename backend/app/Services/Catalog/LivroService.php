<?php

namespace App\Services\Catalog;

use App\Domain\Exceptions\IsbnDuplicadoException;
use App\Domain\Exceptions\RecursoEmUsoException;
use App\Models\Livro;
use App\Repositories\Catalog\AutorRepositoryInterface;
use App\Repositories\Catalog\CategoriaRepositoryInterface;
use App\Repositories\Catalog\EditoraRepositoryInterface;
use App\Repositories\Catalog\LivroRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class LivroService
{
    public function __construct(
        private readonly LivroRepositoryInterface $livros,
        private readonly EditoraRepositoryInterface $editoras,
        private readonly AutorRepositoryInterface $autores,
        private readonly CategoriaRepositoryInterface $categorias,
        private readonly BuscaCatalogoService $busca,
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

            try {
                $livro = $this->livros->criar([
                    'id_editora' => $editora->id_editora,
                    'titulo' => $dto->titulo,
                    'isbn' => $dto->isbn,
                    'ano_publicacao' => $dto->anoPublicacao,
                ]);
            } catch (QueryException $e) {
                if ($e->getCode() === '23505') {
                    throw new IsbnDuplicadoException(details: ['isbn' => $dto->isbn]);
                }

                throw $e;
            }

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

    /**
     * @param  array<string, mixed>  $filtros
     * @return LengthAwarePaginator<int, Livro>
     */
    public function listar(array $filtros): LengthAwarePaginator
    {
        return $this->busca->buscar(
            $filtros['q'] ?? null,
            max(1, (int) ($filtros['page'] ?? 1)),
            min(100, max(1, (int) ($filtros['per_page'] ?? 20))),
        );
    }

    public function detalhe(int $id): Livro
    {
        $livro = $this->livros->comDetalhes($id);
        abort_if($livro === null, 404, 'Livro nao encontrado.');

        $livro->setAttribute('contagem_exemplares', $this->livros->contagemPorStatus($id));

        return $livro;
    }

    public function atualizar(int $id, LivroUpdateDto $dto): Livro
    {
        return DB::transaction(function () use ($id, $dto): Livro {
            $livro = $this->livros->comDetalhes($id);
            abort_if($livro === null, 404, 'Livro nao encontrado.');

            if ($dto->isbn !== null) {
                $existente = $this->livros->buscarPorIsbn($dto->isbn);
                if ($existente !== null && $existente->id_livro !== $livro->id_livro) {
                    throw new IsbnDuplicadoException(details: ['isbn' => $dto->isbn]);
                }
                $livro->isbn = $dto->isbn;
            }

            if ($dto->titulo !== null) {
                $livro->titulo = $dto->titulo;
            }
            if ($dto->anoPublicacao !== null) {
                $livro->ano_publicacao = $dto->anoPublicacao;
            }
            if ($dto->idEditora !== null) {
                $livro->id_editora = $dto->idEditora;
            }

            $livro->save();

            if ($dto->autores !== null) {
                $livro->autores()->sync(collect($dto->autores)->pluck('id_autor')->all());
            }
            if ($dto->categorias !== null) {
                $livro->categorias()->sync(collect($dto->categorias)->pluck('id_categoria')->all());
            }

            return $this->detalhe($id);
        });
    }

    public function remover(int $id): void
    {
        DB::transaction(function () use ($id): void {
            $livro = $this->livros->comDetalhes($id);
            abort_if($livro === null, 404, 'Livro nao encontrado.');

            $totalExemplares = $livro->exemplares()->count();
            if ($totalExemplares > 0) {
                throw new RecursoEmUsoException(
                    'Livro possui exemplares vinculados.',
                    ['exemplares' => $totalExemplares],
                    'LIVRO_COM_EXEMPLARES',
                );
            }

            $livro->delete();
        });
    }
}
