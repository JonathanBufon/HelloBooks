<?php

namespace App\Domain\Exceptions;

class IsbnDuplicadoException extends DomainException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(string $message = 'ISBN ja cadastrado.', array $details = [])
    {
        parent::__construct('ISBN_DUPLICADO', $message, $details);
    }
}
