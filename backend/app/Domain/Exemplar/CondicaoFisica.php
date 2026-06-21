<?php

namespace App\Domain\Exemplar;

enum CondicaoFisica: string
{
    case Intacto = 'intacto';
    case Rabiscado = 'rabiscado';
    case Rasgado = 'rasgado';
    case Dobrado = 'dobrado';
}
