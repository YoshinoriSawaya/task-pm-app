<?php

// api-design.md「GET /api/bugs」「GET /api/bugs/{id}」の契約に対するテスト。

it('バグ一覧を取得できる', function () {
    // Arrange
    $this->postJson('/api/bugs', ['title' => 'バグ1', 'discovered_at' => '2026-09-05']);
    $this->postJson('/api/bugs', ['title' => 'バグ2', 'discovered_at' => '2026-09-05']);

    // Act
    $response = $this->getJson('/api/bugs');

    // Assert
    $response->assertOk();
    expect($response->json('data'))->toHaveCount(2);
});

it('バグ詳細を取得できる', function () {
    // Arrange
    $bug = $this->postJson('/api/bugs', ['title' => '対象バグ', 'discovered_at' => '2026-09-05'])->json();

    // Act
    $response = $this->getJson("/api/bugs/{$bug['id']}");

    // Assert
    $response->assertOk()->assertJson(['id' => $bug['id'], 'title' => '対象バグ']);
});

it('存在しないバグは404を返す', function () {
    // Act
    $response = $this->getJson('/api/bugs/99999');

    // Assert
    $response->assertNotFound();
});
