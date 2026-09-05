<?php

// 環境構築確認(#12)用のスモークテスト。実際のTask/Bug/Progress機能のFeature Testは
// #15, #44-#46, #50で追加していく(docs/development/coding-standards.md参照)。

it('ヘルスチェックエンドポイントが200を返す', function () {
    $response = $this->get('/up');

    $response->assertStatus(200);
});

it('ルートがアプリのステータスをJSONで返す', function () {
    $response = $this->getJson('/');

    $response->assertOk()->assertJson(['status' => 'ok']);
});
