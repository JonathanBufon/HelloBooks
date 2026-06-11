<?php

namespace App\Domain\Exceptions;

class TransicaoInvalidaException extends DomainException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(string $message = 'Transicao de status invalida.', array $details = [])
    {
        parent::__construct('TRANSICAO_INVALIDA', $message, $details);
    }
}
