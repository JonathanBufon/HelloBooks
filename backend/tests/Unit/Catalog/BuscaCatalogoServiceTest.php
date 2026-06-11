<?php

namespace Tests\Unit\Catalog;

use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Editora;
use App\Models\Livro;
use App\Services\Catalog\BuscaCatalogoService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class BuscaCatalogoServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_busca_usa_unaccent_e_retorna_match_acento_insensitive(): void
    {
        $this->livro('Memórias Póstumas de Brás Cubas');

        $sqlExecutado = [];
        DB::listen(function ($query) use (&$sqlExecutado): void {
            $sqlExecutado[] = $query->sql;
        });

        $resultado = app(BuscaCatalogoService::class)->buscar('memorias', 1, 20);

        $this->assertSame(1, $resultado->total());
        $this->assertStringContainsString('immutable_unaccent', implode(' ', $sqlExecutado));
    }

    private function livro(string $titulo): Livro
    {
        $editora = Editora::query()->create(['nome' => 'Editora Teste']);
        $autor = Autor::query()->create(['nome' => 'Machado de Assis']);
        $categoria = Categoria::query()->create(['nome' => 'Romance']);

        $livro = Livro::query()->create([
            'id_editora' => $editora->id_editora,
            'titulo' => $titulo,
            'isbn' => '9788535910663',
            'ano_publicacao' => 1881,
        ]);
        $livro->autores()->attach($autor->id_autor);
        $livro->categorias()->attach($categoria->id_categoria);

        return $livro;
    }
}
