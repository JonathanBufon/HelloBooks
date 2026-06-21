<?php

namespace App\Domain\Exemplar;

enum StatusExemplar: string
{
    case Disponivel = 'disponivel';
    case Emprestado = 'emprestado';
    case Reservado = 'reservado';
    case Manutencao = 'manutencao';
}
