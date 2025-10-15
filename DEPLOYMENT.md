# 🚀 Руководство по развертыванию Digital Hustlas

## 📋 Содержание
1. [Подготовка сервера](#подготовка-сервера)
2. [Развертывание через скрипты](#развертывание-через-скрипты)
3. [Развертывание через Docker](#развертывание-через-docker)
4. [Настройка Nginx](#настройка-nginx)
5. [Мониторинг и логи](#мониторинг-и-логи)
6. [Обновление приложения](#обновление-приложения)
7. [Устранение неполадок](#устранение-неполадок)

## 🖥️ Подготовка сервера

### Требования к серверу:
- **ОС**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+
- **RAM**: минимум 1GB, рекомендуется 2GB+
- **CPU**: 1 ядро, рекомендуется 2+
- **Диск**: минимум 5GB свободного места
- **Сеть**: открытые порты 80, 443, 3000, 3001

### Подключение к серверу:
```bash
ssh username@your-server-ip
```

## 🛠️ Развертывание через скрипты

### 1. Загрузка проекта на сервер

```bash
# Клонируем репозиторий (если есть)
git clone https://github.com/your-username/digital-hustlas.git
cd digital-hustlas

# Или загружаем архив
scp -r /path/to/digital-hustlas username@server-ip:/home/username/
```

### 2. Установка и запуск

```bash
# Делаем скрипты исполняемыми
chmod +x *.sh

# Устанавливаем все зависимости
./install.sh

# Запускаем приложение
./start.sh
```

### 3. Проверка работы

```bash
# Проверяем статус процессов
pm2 status

# Проверяем логи
pm2 logs

# Проверяем API
curl http://localhost:3001/api/health

# Проверяем веб-приложение
curl http://localhost:3000
```

## 🐳 Развертывание через Docker

### 1. Установка Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### 2. Установка Docker Compose

```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Запуск приложения

```bash
# Обычный запуск
docker-compose up -d

# С Nginx
docker-compose --profile nginx up -d

# Просмотр логов
docker-compose logs -f
```

### 4. Остановка

```bash
docker-compose down
```

## 🌐 Настройка Nginx

### 1. Установка Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
```

### 2. Конфигурация

```bash
# Копируем конфигурацию
sudo cp nginx.conf /etc/nginx/nginx.conf

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 3. Настройка SSL (опционально)

```bash
# Устанавливаем Certbot
sudo apt install certbot python3-certbot-nginx

# Получаем сертификат
sudo certbot --nginx -d yourdomain.com

# Автообновление
sudo crontab -e
# Добавляем: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Мониторинг и логи

### PM2 мониторинг

```bash
# Статус процессов
pm2 status

# Логи в реальном времени
pm2 logs

# Логи конкретного процесса
pm2 logs digital-hustlas-api

# Мониторинг ресурсов
pm2 monit

# Перезапуск
pm2 restart all
```

### Docker мониторинг

```bash
# Статус контейнеров
docker ps

# Логи
docker-compose logs -f

# Использование ресурсов
docker stats
```

### Системные логи

```bash
# Логи Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Логи приложения
tail -f logs/api.log
tail -f logs/web.log
```

## 🔄 Обновление приложения

### Через скрипты

```bash
# Останавливаем приложение
./stop.sh

# Обновляем код
git pull origin main

# Устанавливаем новые зависимости
npm install

# Пересобираем
npm run build

# Запускаем
./start.sh
```

### Через Docker

```bash
# Останавливаем
docker-compose down

# Пересобираем образ
docker-compose build --no-cache

# Запускаем
docker-compose up -d
```

## 🔧 Устранение неполадок

### Проблемы с портами

```bash
# Проверяем занятые порты
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :3001

# Освобождаем порт
sudo kill -9 PID
```

### Проблемы с базой данных

```bash
# Проверяем права доступа
ls -la /home/ubuntu/ProdBy/database.db

# Исправляем права
chmod 664 /home/ubuntu/ProdBy/database.db
chown $USER:$USER /home/ubuntu/ProdBy/database.db

# Создаем директорию если не существует
mkdir -p /home/ubuntu/ProdBy
```

### Проблемы с зависимостями

```bash
# Очищаем кэш npm
npm cache clean --force

# Удаляем node_modules
rm -rf node_modules package-lock.json

# Переустанавливаем
npm install
```

### Проблемы с PM2

```bash
# Очищаем PM2
pm2 kill

# Удаляем все процессы
pm2 delete all

# Запускаем заново
./start.sh
```

## 📝 Полезные команды

### Система

```bash
# Проверка места на диске
df -h

# Проверка памяти
free -h

# Проверка процессов
top
htop

# Проверка сетевых соединений
ss -tlnp
```

### Приложение

```bash
# Проверка API
curl -X GET http://localhost:3001/api/health

# Проверка веб-приложения
curl -I http://localhost:3000

# Проверка базы данных
sqlite3 /home/ubuntu/ProdBy/database.db ".tables"
```

## 🔐 Безопасность

### Firewall

```bash
# Ubuntu/Debian (ufw)
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-port=22/tcp
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### Обновления системы

```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `pm2 logs` или `docker-compose logs`
2. Проверьте статус: `pm2 status` или `docker ps`
3. Проверьте ресурсы: `htop` или `docker stats`
4. Проверьте сеть: `curl http://localhost:3001/api/health`

---

**Удачного развертывания! 🚀**
