<?php

namespace App\Domain\Exceptions;

use RuntimeException;

class DomainException extends RuntimeException
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(
        private readonly string $errorCode,
        string $message,
        private readonly array $details = [],
        int $code = 0,
        ?\Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }

    public function errorCode(): string
    {
        return $this->errorCode;
    }

    /**
     * @return array<string, mixed>
     */
    public function details(): array
    {
        return $this->details;
    }

    public function status(): int
    {
        return 409;
    }
}
