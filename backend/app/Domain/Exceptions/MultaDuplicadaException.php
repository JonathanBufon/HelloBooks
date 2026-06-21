<?php

namespace App\Domain\Exceptions;

class MultaDuplicadaException extends DomainException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(string $message = 'Multa ja registrada para este item e motivo.', array $details = [])
    {
        parent::__construct('MULTA_DUPLICADA', $message, $details);
    }
}
