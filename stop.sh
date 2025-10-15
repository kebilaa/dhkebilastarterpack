#!/bin/bash

# Скрипт остановки Digital Hustlas
echo "🛑 Остановка Digital Hustlas..."

# Останавливаем все процессы
pm2 stop digital-hustlas-api 2>/dev/null || true
pm2 stop digital-hustlas-web 2>/dev/null || true

# Удаляем процессы
pm2 delete digital-hustlas-api 2>/dev/null || true
pm2 delete digital-hustlas-web 2>/dev/null || true

echo "✅ Digital Hustlas остановлен!"
echo "📊 Статус процессов:"
pm2 status
