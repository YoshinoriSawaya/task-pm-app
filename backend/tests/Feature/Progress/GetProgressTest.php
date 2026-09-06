<?php

// api-design.md「GET /api/progress」の契約に対するテスト(ADR-0002のEVM計算式)。

it('タスクが無い場合はBAC等がすべて0でCPI/SPIは1になる', function () {
    // Act
    $response = $this->getJson('/api/progress');

    // Assert
    $response->assertOk()->assertJson([
        'evm' => [
            'bac' => 0, 'pv' => 0, 'ev' => 0, 'ac' => 0,
            'cv' => 0, 'sv' => 0, 'cpi' => 1, 'spi' => 1,
            'eac' => 0, 'etc' => 0, 'vac' => 0,
        ],
        'bugs' => [
            'total' => 0, 'open' => 0, 'resolved' => 0,
            'resolution_rate' => null, 'defect_density' => null,
        ],
    ]);
});

it('末端タスクの工数・ステータス・期限からEVM指標とバグ検知度を計算する', function () {
    // Arrange: 親タスク(子を持つため末端集計から除外される。estimated_effort=100が紛れ込まないことを確認)
    $parent = $this->postJson('/api/tasks', ['title' => '親', 'estimated_effort' => 100])->json();

    // 末端タスクA: 完了・期限は今日・見積り4/実績3
    $taskA = $this->postJson('/api/tasks', [
        'title' => 'A',
        'estimated_effort' => 4,
        'due_date' => now()->toDateString(),
    ])->json();
    $this->patchJson("/api/tasks/{$taskA['id']}", ['status' => 'done', 'actual_effort' => 3]);

    // 末端タスクB: 進行中・期限は未来(PVに算入されない)・見積り6/実績2
    $taskB = $this->postJson('/api/tasks', [
        'title' => 'B',
        'estimated_effort' => 6,
        'due_date' => now()->addDays(10)->toDateString(),
    ])->json();
    $this->patchJson("/api/tasks/{$taskB['id']}", ['actual_effort' => 2]);

    // 末端タスクC: 親の子タスク・期限なし(PVに算入されない)・見積り2/実績1
    $taskC = $this->postJson('/api/tasks', [
        'title' => 'C',
        'parent_task_id' => $parent['id'],
        'estimated_effort' => 2,
    ])->json();
    $this->patchJson("/api/tasks/{$taskC['id']}", ['actual_effort' => 1]);

    // バグ3件(解決1件・未解決2件)。完了済み末端タスクは1件(A)
    $this->postJson('/api/bugs', ['title' => 'バグ1', 'discovered_at' => now()->toDateString()]);
    $this->postJson('/api/bugs', ['title' => 'バグ2', 'discovered_at' => now()->toDateString()]);
    $bug3 = $this->postJson('/api/bugs', ['title' => 'バグ3', 'discovered_at' => now()->toDateString()])->json();
    $this->patchJson("/api/bugs/{$bug3['id']}", ['status' => 'resolved', 'resolved_at' => now()->toDateString()]);

    // Act
    $response = $this->getJson('/api/progress');

    // Assert
    $response->assertOk();
    // JSONは整数値になり得るfloat(例: 12.0)をintで返すことがあるため、値の比較はtoEqual(==)で行う
    $evm = $response->json('evm');
    expect($evm['bac'])->toEqual(12.0); // 親の100は除外、4+6+2
    expect($evm['pv'])->toEqual(4.0); // 期限<=今日はAのみ
    expect($evm['ev'])->toEqual(4.0); // doneはAのみ
    expect($evm['ac'])->toEqual(6.0); // 3+2+1
    expect($evm['cv'])->toEqual(-2.0);
    expect($evm['sv'])->toEqual(0.0);
    expect($evm['cpi'])->toEqual(0.67);
    expect($evm['spi'])->toEqual(1.0);
    expect($evm['eac'])->toEqual(18.0);
    expect($evm['etc'])->toEqual(12.0);
    expect($evm['vac'])->toEqual(-6.0);

    $bugs = $response->json('bugs');
    expect($bugs['total'])->toEqual(3);
    expect($bugs['open'])->toEqual(2);
    expect($bugs['resolved'])->toEqual(1);
    expect($bugs['resolution_rate'])->toEqual(0.3333);
    expect($bugs['defect_density'])->toEqual(3.0);
});

// #50: EVM計算ロジックの境界値ユニットテスト(ADR-0002)

it('実績工数が誰も記録されていない場合、AC=0としてCPIを1で扱う', function () {
    // Arrange: 見積りのみのタスク(actual_effortは未記録のまま)
    $this->postJson('/api/tasks', ['title' => 'A', 'estimated_effort' => 4]);
    $this->postJson('/api/tasks', ['title' => 'B', 'estimated_effort' => 6]);

    // Act
    $response = $this->getJson('/api/progress');

    // Assert
    $evm = $response->json('evm');
    expect($evm['ac'])->toEqual(0.0);
    expect($evm['ev'])->toEqual(0.0); // 未着手のためdoneなし
    expect($evm['cpi'])->toEqual(1.0); // AC=0のため「予定通り」扱い
});

it('期限が今日以前のタスクが無い場合、PV=0としてSPIを1で扱う', function () {
    // Arrange: 期限は未来のみ(または未設定)のタスクを完了させる
    $task = $this->postJson('/api/tasks', [
        'title' => 'A',
        'estimated_effort' => 4,
        'due_date' => now()->addDays(10)->toDateString(),
    ])->json();
    $this->patchJson("/api/tasks/{$task['id']}", ['status' => 'done', 'actual_effort' => 4]);

    // Act
    $response = $this->getJson('/api/progress');

    // Assert
    $evm = $response->json('evm');
    expect($evm['pv'])->toEqual(0.0);
    expect($evm['ev'])->toEqual(4.0); // doneなのでEVは計上される
    expect($evm['spi'])->toEqual(1.0); // PV=0のため「予定通り」扱い
});

it('完了済み末端タスクが0件の場合、バグが存在してもdefect_densityはnullになる', function () {
    // Arrange: タスクは未完了のまま、バグのみ登録する
    $this->postJson('/api/tasks', ['title' => 'A', 'estimated_effort' => 4]);
    $this->postJson('/api/bugs', ['title' => 'バグ1', 'discovered_at' => now()->toDateString()]);

    // Act
    $response = $this->getJson('/api/progress');

    // Assert
    $bugs = $response->json('bugs');
    expect($bugs['total'])->toEqual(1);
    expect($bugs['resolution_rate'])->toEqual(0.0); // バグ自体は存在するのでnullにはならない
    expect($bugs['defect_density'])->toBeNull(); // 完了済み末端タスクが0件のためnull
});
