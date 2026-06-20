<?php

namespace App\Domain\Exceptions;

class EmailDuplicadoException extends DomainException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(string $message = 'Email ja cadastrado.', array $details = [])
    {
        parent::__construct('EMAIL_DUPLICADO', $message, $details);
    }
}
