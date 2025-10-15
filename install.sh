#!/bin/bash

# Скрипт установки для Digital Hustlas
echo "🚀 Установка Digital Hustlas..."

# Обновляем систему
echo "📦 Обновление системы..."
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js (LTS версия)
echo "📦 Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверяем версии
echo "✅ Проверка версий:"
node --version
npm --version

# Устанавливаем PM2 для управления процессами
echo "📦 Установка PM2..."
sudo npm install -g pm2

# Устанавливаем зависимости проекта
echo "📦 Установка зависимостей проекта..."
npm install

# Собираем проект
echo "🏗️ Сборка проекта..."
npm run build

# Создаем директории для логов и базы данных
echo "📁 Создание директорий..."
mkdir -p logs
mkdir -p uploads
mkdir -p /home/ubuntu/ProdBy

# Проверяем наличие базы данных
if [ ! -f "/home/ubuntu/ProdBy/database.db" ]; then
    echo "⚠️  База данных не найдена в /home/ubuntu/ProdBy/database.db"
    echo "📋 Убедитесь, что база данных находится по правильному пути"
    if [ -f "./database.db" ]; then
        echo "📋 Копируем базу данных из текущей директории..."
        cp ./database.db /home/ubuntu/ProdBy/database.db
        echo "✅ База данных скопирована"
    fi
else
    echo "✅ База данных найдена в /home/ubuntu/ProdBy/database.db"
fi

# Устанавливаем права доступа
echo "🔐 Настройка прав доступа..."
chmod +x start.sh
chmod +x stop.sh
chmod +x restart.sh

echo "✅ Установка завершена!"
echo "📋 Для запуска используйте: ./start.sh"
echo "📋 Для остановки используйте: ./stop.sh"
echo "📋 Для перезапуска используйте: ./restart.sh"
