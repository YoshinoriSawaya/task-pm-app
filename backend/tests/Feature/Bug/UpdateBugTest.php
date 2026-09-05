<?php

// api-design.md「PATCH /api/bugs/{id}」の契約に対するテスト。

it('statusとresolved_atを更新して解決済みにできる', function () {
    // Arrange
    $bug = $this->postJson('/api/bugs', ['title' => '対象', 'discovered_at' => '2026-09-05'])->json();

    // Act
    $response = $this->patchJson("/api/bugs/{$bug['id']}", [
        'status' => 'resolved',
        'resolved_at' => '2026-09-06',
    ]);

    // Assert
    $response->assertOk()->assertJson(['status' => 'resolved', 'resolved_at' => '2026-09-06']);
});

it('statusがopenのままresolved_atを指定すると422を返す', function () {
    // Arrange
    $bug = $this->postJson('/api/bugs', ['title' => '対象', 'discovered_at' => '2026-09-05'])->json();

    // Act
    $response = $this->patchJson("/api/bugs/{$bug['id']}", ['resolved_at' => '2026-09-06']);

    // Assert
    $response->assertUnprocessable();
});

it('存在しないバグの更新は404を返す', function () {
    // Act
    $response = $this->patchJson('/api/bugs/99999', ['title' => 'x']);

    // Assert
    $response->assertNotFound();
});
