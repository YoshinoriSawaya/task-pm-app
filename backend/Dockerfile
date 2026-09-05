# ローカル開発用(docker-compose.yml から利用)。
# 本番(ADR-0003: EC2単体構成)でも同じイメージをベースに、nginx等でリバースプロキシする想定。
FROM php:8.3-cli

RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libzip-dev libonig-dev \
    && docker-php-ext-install pdo_mysql mbstring zip bcmath \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
