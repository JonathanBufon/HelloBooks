<?php

namespace Database\Seeders;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        Usuario::query()->updateOrCreate(
            ['email' => 'biblio@hello.local'],
            [
                'nome_completo' => 'Bibliotecario HelloBooks',
                'cargo' => CargoUsuario::Bibliotecario,
                'senha_hash' => 'secret123',
            ],
        );
    }
}
