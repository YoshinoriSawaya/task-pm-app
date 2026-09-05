<?php

namespace App\Features\Progress\Application\UseCases;

use App\Features\Progress\Infrastructure\Query\ProgressQueryService;
use Illuminate\Support\Carbon;

// EVM計算式・バグ検知度の算出(ADR-0002)。
final class CalculateEvmSummary
{
    public function __construct(private readonly ProgressQueryService $query)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        $leafTasks = $this->query->leafTasks();
        $today = Carbon::today()->toDateString();

        $bac = (float) $leafTasks->sum('estimated_effort');
        $pv = (float) $leafTasks
            ->filter(fn ($task) => $task->due_date !== null && $task->due_date <= $today)
            ->sum('estimated_effort');
        $ev = (float) $leafTasks->where('status', 'done')->sum('estimated_effort');
        $ac = (float) $leafTasks->sum('actual_effort');

        $cv = $ev - $ac;
        $sv = $ev - $pv;
        // AC=0またはPV=0のときは「予定通り」とみなしCPI/SPIを1として扱う(ADR-0002)
        $cpi = $ac === 0.0 ? 1.0 : $ev / $ac;
        $spi = $pv === 0.0 ? 1.0 : $ev / $pv;
        $eac = $cpi === 0.0 ? $ac : $ac + ($bac - $ev) / $cpi;
        $etc = $eac - $ac;
        $vac = $bac - $eac;

        $bugs = $this->query->bugs();
        $totalBugs = $bugs->count();
        $openBugs = $bugs->where('status', 'open')->count();
        $resolvedBugs = $bugs->where('status', 'resolved')->count();
        $resolutionRate = $totalBugs > 0 ? round($resolvedBugs / $totalBugs, 4) : null;
        $completedLeafTaskCount = $leafTasks->where('status', 'done')->count();
        $defectDensity = $completedLeafTaskCount > 0 ? round($totalBugs / $completedLeafTaskCount, 4) : null;

        return [
            'evm' => [
                'bac' => round($bac, 2),
                'pv' => round($pv, 2),
                'ev' => round($ev, 2),
                'ac' => round($ac, 2),
                'cv' => round($cv, 2),
                'sv' => round($sv, 2),
                'cpi' => round($cpi, 2),
                'spi' => round($spi, 2),
                'eac' => round($eac, 2),
                'etc' => round($etc, 2),
                'vac' => round($vac, 2),
            ],
            'bugs' => [
                'total' => $totalBugs,
                'open' => $openBugs,
                'resolved' => $resolvedBugs,
                'resolution_rate' => $resolutionRate,
                'defect_density' => $defectDensity,
            ],
            'calculated_at' => now()->toJSON(),
        ];
    }
}
