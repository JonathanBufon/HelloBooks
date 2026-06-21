<?php

namespace Database\Seeders;

use App\Domain\Usuario\CargoUsuario;
use App\Models\Usuario;
use Illuminate\Database\Seeder;

class UsuarioSeeder extends Seeder
{
    public function run(): void
    {
        $usuarios = [
            ['Bibliotecario HelloBooks', 'biblio@hello.local', CargoUsuario::Bibliotecario, 'secret123'],
            ['Leitor HelloBooks', 'leitor@hello.local', CargoUsuario::Leitor, 'secret123'],
            ['Ana Leitora', 'ana.leitora@hello.local', CargoUsuario::Leitor, 'secret123'],
            ['Bruno Atrasado', 'bruno.atrasado@hello.local', CargoUsuario::Leitor, 'secret123'],
            ['Carla Sem Pendencias', 'carla.sem-pendencias@hello.local', CargoUsuario::Leitor, 'secret123'],
        ];

        foreach ($usuarios as [$nome, $email, $cargo, $senha]) {
            Usuario::query()->updateOrCreate(
                ['email' => $email],
                [
                    'nome_completo' => $nome,
                    'cargo' => $cargo,
                    'senha_hash' => $senha,
                ],
            );
        }
    }
}
