<?php

namespace App\Features\Task\Domain;

enum TaskPriority: string
{
    case High = 'high';
    case Medium = 'medium';
    case Low = 'low';
}
