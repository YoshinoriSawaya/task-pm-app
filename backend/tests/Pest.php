<?php

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
|
| Feature Test(tests/Feature/)はHTTP経由の結合テストのため、TestCase +
| RefreshDatabaseを使う。Unit Test(tests/Unit/)はDomain/Applicationの
| 単体テストのためTestCaseに紐付けない(docs/development/coding-standards.md参照)。
|
*/

pest()->extend(TestCase::class)
    ->use(RefreshDatabase::class)
    ->in('Feature');
