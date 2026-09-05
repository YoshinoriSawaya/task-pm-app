<?php

namespace App\Features\Bug\Domain;

enum BugSeverity: string
{
    case High = 'high';
    case Medium = 'medium';
    case Low = 'low';
}
