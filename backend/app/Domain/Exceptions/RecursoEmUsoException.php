<?php

namespace App\Domain\Exceptions;

class RecursoEmUsoException extends DomainException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(
        string $message = 'Recurso em uso.',
        array $details = [],
        string $errorCode = 'RECURSO_EM_USO',
        ?\Throwable $previous = null,
    ) {
        parent::__construct($errorCode, $message, $details, previous: $previous);
    }
}
