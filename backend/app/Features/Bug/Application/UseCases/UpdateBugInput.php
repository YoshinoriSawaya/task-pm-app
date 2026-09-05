<?php

namespace App\Features\Bug\Application\UseCases;

final class UpdateBugInput
{
    /**
     * @param array<string, mixed> $attributes 実際に送られてきたフィールドのみを含む(部分更新)
     */
    public function __construct(public readonly array $attributes)
    {
    }
}
