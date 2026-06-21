<?php

namespace App\Domain\Exceptions;

class AutoExclusaoException extends DomainException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(string $message = 'Auto-exclusao proibida.', array $details = [])
    {
        parent::__construct('AUTO_EXCLUSAO_PROIBIDA', $message, $details);
    }
}
