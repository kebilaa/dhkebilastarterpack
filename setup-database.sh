#!/bin/bash

# Скрипт настройки базы данных для Digital Hustlas
echo "🗄️ Настройка базы данных Digital Hustlas..."

# Создаем директорию для базы данных
echo "📁 Создание директории для базы данных..."
mkdir -p /home/ubuntu/ProdBy

# Проверяем, существует ли база данных
if [ -f "/home/ubuntu/ProdBy/database.db" ]; then
    echo "✅ База данных уже существует в /home/ubuntu/ProdBy/database.db"
    
    # Проверяем права доступа
    echo "🔐 Проверка прав доступа..."
    ls -la /home/ubuntu/ProdBy/database.db
    
    # Исправляем права если нужно
    chmod 664 /home/ubuntu/ProdBy/database.db
    chown $USER:$USER /home/ubuntu/ProdBy/database.db
    
    echo "✅ Права доступа настроены"
else
    echo "⚠️  База данных не найдена в /home/ubuntu/ProdBy/database.db"
    
    # Ищем базу данных в других местах
    if [ -f "./database.db" ]; then
        echo "📋 Найдена база данных в текущей директории. Копируем..."
        cp ./database.db /home/ubuntu/ProdBy/database.db
        chmod 664 /home/ubuntu/ProdBy/database.db
        chown $USER:$USER /home/ubuntu/ProdBy/database.db
        echo "✅ База данных скопирована и настроена"
    else
        echo "❌ База данных не найдена. Создаем пустую базу данных..."
        
        # Создаем пустую базу данных (если нужно)
        sqlite3 /home/ubuntu/ProdBy/database.db "CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY);"
        chmod 664 /home/ubuntu/ProdBy/database.db
        chown $USER:$USER /home/ubuntu/ProdBy/database.db
        echo "✅ Пустая база данных создана"
        echo "⚠️  Не забудьте импортировать ваши данные!"
    fi
fi

# Проверяем подключение к базе данных
echo "🔍 Проверка подключения к базе данных..."
if command -v sqlite3 &> /dev/null; then
    if sqlite3 /home/ubuntu/ProdBy/database.db "SELECT 1;" &> /dev/null; then
        echo "✅ Подключение к базе данных успешно"
        
        # Показываем информацию о базе данных
        echo "📊 Информация о базе данных:"
        echo "   Размер: $(du -h /home/ubuntu/ProdBy/database.db | cut -f1)"
        echo "   Таблицы:"
        sqlite3 /home/ubuntu/ProdBy/database.db ".tables" | sed 's/^/     /'
    else
        echo "❌ Ошибка подключения к базе данных"
        exit 1
    fi
else
    echo "⚠️  sqlite3 не установлен. Устанавливаем..."
    sudo apt update
    sudo apt install -y sqlite3
    
    if sqlite3 /home/ubuntu/ProdBy/database.db "SELECT 1;" &> /dev/null; then
        echo "✅ Подключение к базе данных успешно"
    else
        echo "❌ Ошибка подключения к базе данных"
        exit 1
    fi
fi

echo ""
echo "🎉 Настройка базы данных завершена!"
echo "📁 Путь к базе данных: /home/ubuntu/ProdBy/database.db"
echo "🔐 Права доступа настроены"
echo ""
echo "📋 Полезные команды:"
echo "  sqlite3 /home/ubuntu/ProdBy/database.db  - открыть базу данных"
echo "  ls -la /home/ubuntu/ProdBy/              - проверить файлы"
echo "  du -h /home/ubuntu/ProdBy/database.db    - размер базы данных"
