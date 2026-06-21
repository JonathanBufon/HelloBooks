<?php

namespace App\Domain\SolicitacaoEmprestimo;

enum StatusSolicitacaoEmprestimo: string
{
    case Pendente = 'pendente';
    case Aprovada = 'aprovada';
    case Recusada = 'recusada';
    case Cancelada = 'cancelada';
}
