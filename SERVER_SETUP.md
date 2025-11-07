# Инструкция по настройке сервера

## Проблема: сайт не доступен по адресу 194.32.140.220.nip.io

### Шаги для исправления:

#### 1. Загрузите обновленные файлы на сервер

Убедитесь, что на сервере есть следующие обновленные файлы:
- `vite.config.js` (исправлен base: '/')
- `web-server.cjs` (новый файл)
- `start.sh` (обновлен для использования web-server.cjs)
- `ecosystem.config.cjs` (обновлен)

#### 2. Пересоберите и перезапустите приложение

```bash
cd /var/www/vhosts/194.32.140.220.nip.io/httpdocs/web

# Пересоберите проект
npm run build

# Перезапустите сервер
./restart.sh
```

#### 3. Настройте Nginx

**Вариант A: Если у вас есть доступ к конфигурации Nginx напрямую**

Создайте файл конфигурации виртуального хоста:

```bash
sudo nano /etc/nginx/sites-available/194.32.140.220.nip.io
```

Скопируйте содержимое из файла `nginx-production.conf` в этот файл.

Затем создайте симлинк:

```bash
sudo ln -s /etc/nginx/sites-available/194.32.140.220.nip.io /etc/nginx/sites-enabled/
```

Проверьте конфигурацию:

```bash
sudo nginx -t
```

Перезапустите Nginx:

```bash
sudo systemctl restart nginx
```

**Вариант B: Если используется панель управления (Plesk, ISPConfig и т.д.)**

1. Войдите в панель управления
2. Найдите настройки виртуального хоста для `194.32.140.220.nip.io`
3. Добавьте следующие настройки в конфигурацию Nginx:

```nginx
location /api/ {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

#### 4. Проверьте, что серверы запущены

```bash
# Проверьте статус PM2
pm2 status

# Проверьте, что порты прослушиваются
netstat -tlnp | grep -E ':(3000|3001)'

# Или используйте ss
ss -tlnp | grep -E ':(3000|3001)'
```

#### 5. Проверьте доступность локально

```bash
# Проверьте API
curl http://localhost:3001/api/health

# Проверьте веб-приложение
curl http://localhost:3000
```

#### 6. Проверьте логи

```bash
# Логи PM2
pm2 logs

# Логи Nginx
sudo tail -f /var/log/nginx/digital-hustlas-access.log
sudo tail -f /var/log/nginx/digital-hustlas-error.log
```

#### 7. Проверьте файрвол

Убедитесь, что порты 80 и 443 открыты:

```bash
# Проверьте статус файрвола
sudo ufw status
# или
sudo iptables -L -n
```

### Возможные проблемы:

1. **PM2 все еще использует старый start.sh**
   - Убедитесь, что файл `start.sh` обновлен на сервере
   - Удалите старые процессы: `pm2 delete all`
   - Запустите заново: `./start.sh`

2. **Nginx не проксирует запросы**
   - Проверьте, что Nginx перезапущен: `sudo systemctl restart nginx`
   - Проверьте логи ошибок: `sudo tail -f /var/log/nginx/error.log`

3. **Порты не доступны**
   - Убедитесь, что приложения запущены: `pm2 status`
   - Проверьте, что порты прослушиваются: `netstat -tlnp | grep 3000`

4. **Файрвол блокирует порты**
   - Откройте порты 80 и 443: `sudo ufw allow 80` и `sudo ufw allow 443`

