#!/bin/bash

# Скрипт перезапуска Digital Hustlas
echo "🔄 Перезапуск Digital Hustlas..."

# Останавливаем процессы
./stop.sh

# Ждем немного
sleep 2

# Запускаем заново
./start.sh
