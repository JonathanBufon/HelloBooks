<?php

namespace App\Domain\Multa;

enum MotivoMulta: string
{
    case Atraso = 'atraso';
    case Rabisco = 'rabisco';
    case Rasgo = 'rasgo';
    case Dobra = 'dobra';
}
