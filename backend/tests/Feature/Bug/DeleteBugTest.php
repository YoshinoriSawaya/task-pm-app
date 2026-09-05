<?php

// api-design.md「DELETE /api/bugs/{id}」の契約に対するテスト。

it('バグを削除すると204を返し一覧から消える', function () {
    // Arrange
    $bug = $this->postJson('/api/bugs', ['title' => '対象', 'discovered_at' => '2026-09-05'])->json();

    // Act
    $response = $this->deleteJson("/api/bugs/{$bug['id']}");

    // Assert
    $response->assertNoContent();
    $this->getJson("/api/bugs/{$bug['id']}")->assertNotFound();
});

it('バグは論理削除される(DBには残る)', function () {
    // Arrange
    $bug = $this->postJson('/api/bugs', ['title' => '対象', 'discovered_at' => '2026-09-05'])->json();

    // Act
    $this->deleteJson("/api/bugs/{$bug['id']}");

    // Assert
    $this->assertSoftDeleted('bugs', ['id' => $bug['id']]);
});

it('存在しないバグの削除は404を返す', function () {
    // Act
    $response = $this->deleteJson('/api/bugs/99999');

    // Assert
    $response->assertNotFound();
});
