<?php

namespace App\Domain\Usuario;

enum CargoUsuario: string
{
    case Bibliotecario = 'bibliotecario';
    case Leitor = 'leitor';
}
