#!/bin/bash

# Быстрый скрипт развертывания для Digital Hustlas
echo "🚀 Быстрое развертывание Digital Hustlas..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Файл package.json не найден. Запустите скрипт из корневой директории проекта."
    exit 1
fi

# Функция для проверки команды
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 не найден. Установите $1 и попробуйте снова."
        exit 1
    fi
}

# Проверяем необходимые команды
echo "🔍 Проверка зависимостей..."
check_command "node"
check_command "npm"

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
npm install

# Собираем проект
echo "🏗️ Сборка проекта..."
npm run build

# Проверяем, что сборка прошла успешно
if [ ! -d "dist" ]; then
    echo "❌ Ошибка сборки. Директория dist не создана."
    exit 1
fi

# Создаем директории для логов
echo "📁 Создание директорий..."
mkdir -p logs

# Проверяем базу данных
if [ ! -f "/home/ubuntu/ProdBy/database.db" ]; then
    echo "⚠️  База данных не найдена в /home/ubuntu/ProdBy/database.db"
    if [ -f "./database.db" ]; then
        echo "📋 Копируем базу данных из текущей директории..."
        mkdir -p /home/ubuntu/ProdBy
        cp ./database.db /home/ubuntu/ProdBy/database.db
        echo "✅ База данных скопирована"
    else
        echo "❌ База данных не найдена. Убедитесь, что она находится в правильном месте."
        exit 1
    fi
else
    echo "✅ База данных найдена в /home/ubuntu/ProdBy/database.db"
fi

# Запускаем приложение
echo "🚀 Запуск приложения..."

# Проверяем, установлен ли PM2
if command -v pm2 &> /dev/null; then
    echo "📊 Используем PM2 для управления процессами..."
    
    # Останавливаем существующие процессы
    pm2 stop digital-hustlas-api 2>/dev/null || true
    pm2 stop digital-hustlas-web 2>/dev/null || true
    pm2 delete digital-hustlas-api 2>/dev/null || true
    pm2 delete digital-hustlas-web 2>/dev/null || true
    
    # Запускаем API сервер
    pm2 start server.cjs --name "digital-hustlas-api" --log logs/api.log --error logs/api-error.log
    
    # Запускаем веб-сервер
    pm2 serve dist 3000 --name "digital-hustlas-web" --spa --log logs/web.log --error logs/web-error.log
    
    # Сохраняем конфигурацию
    pm2 save
    
    echo "✅ Приложение запущено через PM2!"
    echo "📊 Статус: pm2 status"
    echo "📋 Логи: pm2 logs"
    
else
    echo "📊 PM2 не найден. Запускаем напрямую..."
    echo "⚠️  Для остановки используйте Ctrl+C"
    
    # Запускаем API сервер в фоне
    node server.cjs &
    API_PID=$!
    
    # Запускаем веб-сервер
    npx serve dist -s -l 3000 &
    WEB_PID=$!
    
    echo "✅ Приложение запущено!"
    echo "🌐 API: http://localhost:3001"
    echo "🌐 Веб: http://localhost:3000"
    echo "⚠️  Для остановки нажмите Ctrl+C"
    
    # Обработка сигнала завершения
    trap "kill $API_PID $WEB_PID; exit" INT TERM
    
    # Ждем завершения
    wait
fi

echo ""
echo "🎉 Развертывание завершено!"
echo "🌐 API доступен по адресу: http://localhost:3001"
echo "🌐 Веб-приложение доступно по адресу: http://localhost:3000"
echo ""
echo "📋 Полезные команды:"
echo "  curl http://localhost:3001/api/health  - проверка API"
echo "  curl http://localhost:3000             - проверка веб-приложения"
echo "  pm2 status                             - статус процессов (если используется PM2)"
echo "  pm2 logs                               - логи (если используется PM2)"
