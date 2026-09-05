<?php

namespace App\Features\Bug\Domain;

enum BugStatus: string
{
    case Open = 'open';
    case Resolved = 'resolved';
}
