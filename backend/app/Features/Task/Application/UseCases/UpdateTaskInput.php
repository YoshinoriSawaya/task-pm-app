<?php

namespace App\Features\Task\Application\UseCases;

final class UpdateTaskInput
{
    /**
     * @param array<string, mixed> $attributes 実際に送られてきたフィールドのみを含む(部分更新)
     */
    public function __construct(public readonly array $attributes)
    {
    }
}
