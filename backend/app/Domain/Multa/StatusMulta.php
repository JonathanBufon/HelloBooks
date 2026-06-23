<?php

namespace App\Domain\Multa;

enum StatusMulta: string
{
    case Pendente = 'pendente';
    case Paga = 'paga';
    case Perdoada = 'perdoada';
}
