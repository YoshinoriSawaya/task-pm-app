<?php

namespace App\Features\Task\Domain\Exceptions;

use RuntimeException;

// 2階層制約(子タスクはさらに子を持てない)違反時にCreateTaskユースケースが投げる。
final class InvalidTaskHierarchyException extends RuntimeException
{
    public static function becauseParentIsAlreadyAChild(int $parentTaskId): self
    {
        return new self(
            "指定した親タスク(#{$parentTaskId})は既に子タスクのため、これ以上ネストできません。"
        );
    }
}
