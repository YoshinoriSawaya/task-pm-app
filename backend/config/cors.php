<?php

// ローカル開発ではフロント(Vite: localhost:5173)とバックエンド(Laravel: localhost:8000)が
// 別オリジンになるためCORSを許可する。本番はnginxで同一オリジン配信するため実質不要になる想定
// (docs/development/coding-standards.md「CORS」、ADR-0003参照)。

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,
];
