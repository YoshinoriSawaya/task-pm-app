<?php

namespace App\Features\Progress\Presentation\Http\Controllers;

use App\Features\Progress\Application\UseCases\CalculateEvmSummary;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class ProgressController extends Controller
{
    public function show(CalculateEvmSummary $calculateEvmSummary): JsonResponse
    {
        return response()->json($calculateEvmSummary->handle());
    }
}
