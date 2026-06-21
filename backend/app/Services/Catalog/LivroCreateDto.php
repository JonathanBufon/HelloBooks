<?php

namespace App\Services\Catalog;

readonly class LivroCreateDto
{
    /**
     * @param  array<int, array{id_autor?: int, nome?: string}>  $autores
     * @param  array<int, array{id_categoria?: int, nome?: string}>  $categorias
     * @param  array{nome?: string}|null  $editora
     */
    public function __construct(
        public string $titulo,
        public string $isbn,
        public int $anoPublicacao,
        public ?int $idEditora,
        public array $autores,
        public array $categorias,
        public ?array $editora = null,
    ) {}

    /**
     * @param  array<string, mixed>  $dados
     */
    public static function fromArray(array $dados): self
    {
        return new self(
            titulo: $dados['titulo'],
            isbn: $dados['isbn'],
            anoPublicacao: (int) $dados['ano_publicacao'],
            idEditora: isset($dados['id_editora']) ? (int) $dados['id_editora'] : null,
            autores: $dados['autores'],
            categorias: $dados['categorias'],
            editora: $dados['editora'] ?? null,
        );
    }
}
