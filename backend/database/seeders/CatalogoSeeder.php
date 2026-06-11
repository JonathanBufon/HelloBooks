<?php

namespace Database\Seeders;

use App\Models\Autor;
use App\Models\Categoria;
use App\Models\Editora;
use App\Models\Exemplar;
use App\Models\Livro;
use Illuminate\Database\Seeder;

class CatalogoSeeder extends Seeder
{
    public function run(): void
    {
        $editoras = collect(['Companhia das Letras', 'Record', 'Rocco', 'Aleph', 'Intrinseca'])
            ->map(fn (string $nome): Editora => Editora::query()->firstOrCreate(['nome' => $nome]));

        $autores = collect([
            'Machado de Assis',
            'Clarice Lispector',
            'Jorge Amado',
            'Conceicao Evaristo',
            'Italo Calvino',
            'Ursula K. Le Guin',
            'George Orwell',
            'Mary Shelley',
        ])->map(fn (string $nome): Autor => Autor::query()->firstOrCreate(['nome' => $nome]));

        $categorias = collect(['Romance', 'Classico', 'Ficcao Cientifica', 'Fantasia', 'Contos', 'Literatura Brasileira'])
            ->map(fn (string $nome): Categoria => Categoria::query()->firstOrCreate(['nome' => $nome]));

        $titulos = [
            'Dom Casmurro',
            'Memorias Postumas de Bras Cubas',
            'A Hora da Estrela',
            'Capitaes da Areia',
            'Becos da Memoria',
            'As Cidades Invisiveis',
            'A Mao Esquerda da Escuridao',
            '1984',
            'Frankenstein',
            'Quincas Borba',
            'Perto do Coracao Selvagem',
            'Gabriela Cravo e Canela',
            'Olhos d Agua',
            'O Barao nas Arvores',
            'Os Despossuidos',
            'A Revolucao dos Bichos',
            'O Ultimo Homem',
            'Esau e Jaco',
            'Tenda dos Milagres',
            'Marcovaldo',
        ];

        foreach ($titulos as $indice => $titulo) {
            $livro = Livro::query()->updateOrCreate(
                ['isbn' => str_pad((string) (9788500000000 + $indice), 13, '0', STR_PAD_LEFT)],
                [
                    'id_editora' => $editoras[$indice % $editoras->count()]->id_editora,
                    'titulo' => $titulo,
                    'ano_publicacao' => 1950 + $indice,
                ],
            );

            $livro->autores()->sync([$autores[$indice % $autores->count()]->id_autor]);
            $livro->categorias()->sync([
                $categorias[$indice % $categorias->count()]->id_categoria,
                $categorias[($indice + 1) % $categorias->count()]->id_categoria,
            ]);

            if ($livro->exemplares()->count() === 0) {
                foreach (range(1, 3) as $_) {
                    Exemplar::query()->create(['id_livro' => $livro->id_livro]);
                }
            }
        }
    }
}
