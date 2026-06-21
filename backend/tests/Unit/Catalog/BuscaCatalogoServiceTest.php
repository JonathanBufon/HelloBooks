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

    public function test_indice_de_titulo_sustenta_sc_002_com_dez_mil_livros(): void
    {
        if (DB::connection()->getDriverName() !== 'pgsql') {
            $this->markTestSkipped('EXPLAIN ANALYZE de indice funcional requer PostgreSQL.');
        }

        $editora = Editora::query()->create(['nome' => 'Editora Performance']);
        $now = now();

        collect(range(1, 10000))
            ->map(fn (int $indice): array => [
                'id_editora' => $editora->id_editora,
                'titulo' => $indice === 9999 ? 'Livro Alvo Especial' : 'Livro Performance '.$indice,
                'isbn' => str_pad((string) (9788600000000 + $indice), 13, '0', STR_PAD_LEFT),
                'ano_publicacao' => 2000,
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->chunk(1000)
            ->each(fn ($chunk) => DB::table('livros')->insert($chunk->all()));

        DB::statement('SET enable_seqscan = off');

        try {
            $plano = collect(DB::select(
                'EXPLAIN ANALYZE SELECT id_livro FROM livros WHERE lower(immutable_unaccent(titulo)) = lower(immutable_unaccent(?))',
                ['Livro Alvo Especial'],
            ))->map(function (object $linha): string {
                $valores = (array) $linha;

                return (string) reset($valores);
            })->implode("\n");
        } finally {
            DB::statement('RESET enable_seqscan');
        }

        $this->assertStringContainsString('livros_titulo_unaccent_idx', $plano);
        $this->assertMatchesRegularExpression('/Execution Time: ([0-9.]+) ms/', $plano);
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
