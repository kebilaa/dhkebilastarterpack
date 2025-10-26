#!/bin/bash

# Скрипт запуска Digital Hustlas
echo "🚀 Запуск Digital Hustlas..."

# Проверяем, что Node.js установлен
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не найден. Запустите сначала ./install.sh"
    exit 1
fi

# Проверяем, что PM2 установлен
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 не найден. Запустите сначала ./install.sh"
    exit 1
fi

# Собираем проект
echo "🔨 Сборка проекта..."
npm run build

# Копируем файлы из public в dist
echo "📁 Копирование статических файлов..."
cp -r public/* dist/ 2>/dev/null || true

# Останавливаем существующие процессы
echo "🛑 Остановка существующих процессов..."
pm2 stop digital-hustlas-api 2>/dev/null || true
pm2 stop digital-hustlas-web 2>/dev/null || true

# Удаляем старые процессы
pm2 delete digital-hustlas-api 2>/dev/null || true
pm2 delete digital-hustlas-web 2>/dev/null || true

# Запускаем API сервер
echo "🌐 Запуск API сервера..."
pm2 start server.cjs --name "digital-hustlas-api" --log logs/api.log --error logs/api-error.log

# Запускаем веб-сервер (если нужно)
echo "🌐 Запуск веб-сервера..."
pm2 serve dist 3000 --name "digital-hustlas-web" --spa --log logs/web.log --error logs/web-error.log

# Сохраняем конфигурацию PM2
pm2 save

# Настраиваем автозапуск
pm2 startup

echo "✅ Digital Hustlas запущен!"
echo "📊 Статус процессов:"
pm2 status

echo ""
echo "🌐 API доступен по адресу: http://localhost:3001"
echo "🌐 Веб-приложение доступно по адресу: http://localhost:3000"
echo ""
echo "📋 Полезные команды:"
echo "  pm2 status          - статус процессов"
echo "  pm2 logs            - логи всех процессов"
echo "  pm2 logs digital-hustlas-api - логи API"
echo "  pm2 logs digital-hustlas-web - логи веб-сервера"
echo "  ./stop.sh           - остановить все процессы"
echo "  ./restart.sh        - перезапустить все процессы"
