# Инструкция по настройке для Plesk/ISPConfig

## Проблема: "duplicate location '/'"

Ошибка возникает потому, что в базовой конфигурации виртуального хоста уже есть блок `location /`, и вы пытаетесь добавить еще один.

## Решение:

### Вариант 1: Использовать только location /api/ (рекомендуется)

В разделе **"Additional nginx directives"** добавьте **ТОЛЬКО** это:

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

**НЕ добавляйте** `location /` - он уже должен быть в базовой конфигурации.

Затем найдите в настройках виртуального хоста основной блок `location /` и измените его, чтобы он проксировал на `localhost:3000`.

### Вариант 2: Изменить существующий location /

1. Найдите в настройках виртуального хоста основной `location /`
2. Измените его на:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

3. В разделе "Additional nginx directives" добавьте только:

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Вариант 3: Использовать try_files (если статические файлы раздаются через Apache)

Если ваш хостинг использует связку Nginx + Apache, и статические файлы раздаются через Apache, используйте:

```nginx
# API маршруты
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Веб-приложение (если нужно переопределить существующий location /)
location ~ ^/(?!api/) {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Проверка:

После сохранения конфигурации:

1. Проверьте, что Nginx перезапустился без ошибок
2. Проверьте доступность:
   ```bash
   curl http://localhost:3000
   curl http://localhost:3001/api/health
   ```
3. Проверьте сайт в браузере: `http://194.32.140.220.nip.io`

## Важно:

- В Nginx блоки `location` обрабатываются в порядке специфичности
- `location /api/` более специфичен, чем `location /`, поэтому он будет обработан первым
- НЕ создавайте два блока `location /` - это вызовет ошибку

