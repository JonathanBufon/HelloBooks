<?php

namespace App\Domain\Exceptions;

class RecursoEmUsoException extends DomainException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(string $message = 'Recurso em uso.', array $details = [])
    {
        parent::__construct('RECURSO_EM_USO', $message, $details);
    }
}
