<?php

namespace App\Services\Catalog;

readonly class LivroUpdateDto
{
    /**
     * @param  array<int, array{id_autor: int}>|null  $autores
     * @param  array<int, array{id_categoria: int}>|null  $categorias
     */
    public function __construct(
        public ?string $titulo,
        public ?string $isbn,
        public ?int $anoPublicacao,
        public ?int $idEditora,
        public ?array $autores,
        public ?array $categorias,
    ) {}

    /**
     * @param  array<string, mixed>  $dados
     */
    public static function fromArray(array $dados): self
    {
        return new self(
            titulo: $dados['titulo'] ?? null,
            isbn: $dados['isbn'] ?? null,
            anoPublicacao: isset($dados['ano_publicacao']) ? (int) $dados['ano_publicacao'] : null,
            idEditora: isset($dados['id_editora']) ? (int) $dados['id_editora'] : null,
            autores: $dados['autores'] ?? null,
            categorias: $dados['categorias'] ?? null,
        );
    }
}
