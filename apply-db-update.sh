#!/bin/bash

# Скрипт для применения обновлений базы данных Digital Hustlas
echo "🗄️ Применение обновлений базы данных..."

# Проверяем, что sqlite3 установлен
if ! command -v sqlite3 &> /dev/null; then
    echo "❌ sqlite3 не найден. Устанавливаем..."
    sudo apt update
    sudo apt install -y sqlite3
fi

# Путь к базе данных
DB_PATH="/home/ubuntu/ProdBy/database.db"

# Проверяем, существует ли база данных
if [ ! -f "$DB_PATH" ]; then
    echo "❌ База данных не найдена по пути: $DB_PATH"
    echo "📋 Убедитесь, что база данных находится по правильному пути"
    exit 1
fi

# Создаем резервную копию
echo "💾 Создание резервной копии базы данных..."
BACKUP_PATH="/home/ubuntu/ProdBy/database_backup_$(date +%Y%m%d_%H%M%S).db"
cp "$DB_PATH" "$BACKUP_PATH"
echo "✅ Резервная копия создана: $BACKUP_PATH"

# Применяем обновления
echo "🔄 Применение обновлений структуры базы данных..."
if sqlite3 "$DB_PATH" < update-database.sql; then
    echo "✅ Обновления базы данных применены успешно!"
else
    echo "❌ Ошибка при применении обновлений!"
    echo "🔄 Восстанавливаем из резервной копии..."
    cp "$BACKUP_PATH" "$DB_PATH"
    echo "✅ База данных восстановлена из резервной копии"
    exit 1
fi

# Проверяем структуру таблиц
echo "🔍 Проверка структуры таблиц..."
echo ""
echo "📊 Структура таблицы Users:"
sqlite3 "$DB_PATH" "PRAGMA table_info(Users);" | column -t -s '|'

echo ""
echo "📊 Структура таблицы Teams:"
sqlite3 "$DB_PATH" "PRAGMA table_info(Teams);" | column -t -s '|'

# Показываем статистику
echo ""
echo "📈 Статистика обновления:"
echo "👥 Пользователей: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Users;")"
echo "🏆 Команд: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Teams;")"
echo "📊 Записей в Scores: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Scores;")"

echo ""
echo "🎉 Обновление базы данных завершено успешно!"
echo "💾 Резервная копия сохранена: $BACKUP_PATH"
echo ""
echo "📋 Новые поля:"
echo "   Users: kall, tall, user_team_wins, user_team_games, user_solo_wins, user_solo_games"
echo "   Teams: tall, team_wins, team_games"
echo ""
echo "⚠️  Не забудьте перезапустить приложение: ./restart.sh"
