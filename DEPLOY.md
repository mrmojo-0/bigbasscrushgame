# Деплой BigBassCrashGame на VPS с ISPManager 6

Подробная инструкция по развёртыванию сайта на VPS сервере с ISPManager 6, Node.js, PM2 и Nginx.

---

## Требования

- VPS с Ubuntu 22.04+ или Debian 12+
- ISPManager 6 (панель управления)
- Минимум 1 ГБ RAM, 10 ГБ SSD
- Домен `bigbasscrashgame.com` направлен на IP сервера

---

## Шаг 1: Подготовка сервера

### 1.1 Подключение по SSH

```bash
ssh root@ВАШ_IP_АДРЕС
```

### 1.2 Обновление системы

```bash
apt update && apt upgrade -y
apt install -y build-essential curl git
```

### 1.3 Установка Node.js 20 через nvm

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
node -v  # должно показать v20.x.x
```

### 1.4 Установка PM2

```bash
npm install -g pm2
pm2 startup  # автозапуск при перезагрузке сервера
```

---

## Шаг 2: Настройка домена в ISPManager 6

### 2.1 Добавление домена

1. Войдите в ISPManager по адресу `https://ВАШ_IP:1500`
2. Перейдите в раздел **Сайты** → **Создать**
3. Укажите:
   - Домен: `bigbasscrashgame.com`
   - Также создать www-поддомен: **Да**
   - PHP: **Отключить** (мы используем Node.js)
4. Нажмите **Создать**

### 2.2 DNS записи

В панели DNS-хостинга вашего домена создайте:

| Тип | Имя | Значение |
|-----|-----|----------|
| A | @ | ВАШ_IP_АДРЕС |
| A | www | ВАШ_IP_АДРЕС |

### 2.3 SSL сертификат (Let's Encrypt)

1. В ISPManager перейдите в **SSL-сертификаты** → **Создать**
2. Выберите **Let's Encrypt**
3. Домен: `bigbasscrashgame.com`
4. Включите **Автопродление**
5. Нажмите **Создать**

---

## Шаг 3: Загрузка проекта

### 3.1 Клонирование через Git

```bash
# Создаём директорию для приложения
mkdir -p /opt/bigbasscrashgame
cd /opt/bigbasscrashgame

# Клонируем репозиторий (замените URL на ваш)
git clone https://YOUR_REPO_URL.git .
```

### 3.2 Или загрузка через SCP

```bash
# На локальной машине:
scp -r ./bigbasscrushgame/* root@ВАШ_IP:/opt/bigbasscrashgame/
```

---

## Шаг 4: Сборка проекта

### 4.1 Установка зависимостей

```bash
cd /opt/bigbasscrashgame
npm install
```

### 4.2 Инициализация базы данных

```bash
# Создаём директорию для данных
mkdir -p data

# Генерируем миграции и применяем их
npm run db:generate
npm run db:migrate

# Заполняем начальными данными
npm run db:seed
```

> **Важно**: Пароль админки по умолчанию: `admin123`. Обязательно смените его через админку после деплоя!

### 4.3 Скачивание изображений

```bash
npm run fetch-images
```

### 4.4 Оптимизация игровых изображений

```bash
# Обрабатывает 29 исходных изображений из images/ → public/images/game/
# Генерирует WebP версии, оптимизирует размеры
node scripts/optimize-images.mjs
```

> **Примечание**: Папка `images/` содержит исходные изображения и не деплоится. В продакшн попадает только `public/images/game/`.

### 4.5 Генерация фавиконов

```bash
# Создаёт favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png
node scripts/generate-favicon.mjs
```

### 4.6 Сборка

```bash
npm run build
```

Ожидайте сообщение `[build] Complete!`. Сборка генерирует 161 HTML файл (40 языков × 4 страницы + redirect).

---

## Шаг 5: Запуск через PM2

### 5.1 Файл конфигурации PM2

В корне проекта уже есть `ecosystem.config.cjs`:

```javascript
module.exports = {
  apps: [{
    name: 'bigbasscrashgame',
    script: './dist/server/entry.mjs',
    env: {
      NODE_ENV: 'production',
      HOST: '127.0.0.1',
      PORT: 4321,
    },
    max_memory_restart: '500M',
    instances: 1,
    autorestart: true,
  }],
};
```

### 5.2 Запуск

```bash
cd /opt/bigbasscrashgame
pm2 start ecosystem.config.cjs
pm2 save  # сохраняем для автозапуска
```

### 5.3 Проверка

```bash
pm2 status        # статус процесса
pm2 logs bigbasscrashgame  # просмотр логов
curl http://127.0.0.1:4321  # проверка ответа
```

---

## Шаг 6: Настройка Nginx

### 6.1 Конфигурация Nginx

Создайте или отредактируйте конфиг для домена. В ISPManager конфиг обычно находится в `/etc/nginx/vhosts/` или `/etc/nginx/conf.d/`.

Создайте файл `/etc/nginx/conf.d/bigbasscrashgame.conf`:

```nginx
server {
    listen 80;
    server_name bigbasscrashgame.com www.bigbasscrashgame.com;
    return 301 https://bigbasscrashgame.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.bigbasscrashgame.com;

    ssl_certificate /var/www/httpd-cert/bigbasscrashgame.com.crt;
    ssl_certificate_key /var/www/httpd-cert/bigbasscrashgame.com.key;

    return 301 https://bigbasscrashgame.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name bigbasscrashgame.com;

    ssl_certificate /var/www/httpd-cert/bigbasscrashgame.com.crt;
    ssl_certificate_key /var/www/httpd-cert/bigbasscrashgame.com.key;

    # SSL параметры
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Gzip сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript image/svg+xml;
    gzip_min_length 1000;
    gzip_vary on;

    # Корень для статики
    root /opt/bigbasscrashgame/dist/client;

    # Статические файлы - отдаём напрямую через Nginx
    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    location /images/ {
        expires 30d;
        add_header Cache-Control "public";
        try_files $uri =404;
    }

    location /favicon.svg {
        expires 30d;
        try_files $uri =404;
    }

    location /favicon.ico {
        expires 30d;
        try_files $uri =404;
    }

    location /robots.txt {
        expires 1d;
        try_files $uri =404;
    }

    location /sitemap-index.xml {
        expires 1d;
        try_files $uri =404;
    }

    location /sitemap-0.xml {
        expires 1d;
        try_files $uri =404;
    }

    # Всё остальное проксируем на Node.js
    location / {
        proxy_pass http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
    }

    # Защита системных файлов
    location ~ /\. {
        deny all;
    }

    location /data/ {
        deny all;
    }
}
```

> **Примечание**: Пути к SSL-сертификатам могут отличаться в зависимости от настроек ISPManager. Проверьте актуальные пути:
> ```bash
> find /var/www/httpd-cert -name "bigbasscrashgame*" 2>/dev/null
> # или
> find /etc/letsencrypt -name "bigbasscrashgame*" 2>/dev/null
> ```

### 6.2 Если ISPManager управляет Nginx

ISPManager может перезаписывать конфиги при изменении настроек сайта. В этом случае:

1. В ISPManager перейдите в **Сайты** → `bigbasscrashgame.com` → **Настройки**
2. Найдите раздел **Дополнительные настройки Nginx** или **nginx.conf**
3. Добавьте директивы проксирования:

```nginx
location / {
    proxy_pass http://127.0.0.1:4321;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 6.3 Проверка и перезагрузка

```bash
nginx -t               # проверка конфигурации
systemctl reload nginx  # перезагрузка Nginx
```

---

## Шаг 7: Скрипт обновления

Используйте скрипт `scripts/deploy.sh` из проекта или создайте свой:

```bash
#!/bin/bash
# /opt/bigbasscrashgame/update.sh

set -e

echo "=== Обновление BigBassCrashGame ==="
cd /opt/bigbasscrashgame

echo "1. Получаем изменения из Git..."
git pull origin main

echo "2. Устанавливаем зависимости..."
npm install

echo "3. Применяем миграции БД..."
npm run db:migrate

echo "4. Оптимизируем изображения..."
node scripts/optimize-images.mjs
node scripts/generate-favicon.mjs

echo "5. Собираем проект..."
npm run build

echo "6. Перезапускаем PM2..."
pm2 restart bigbasscrashgame

echo "=== Обновление завершено! ==="
pm2 status
```

```bash
chmod +x /opt/bigbasscrashgame/update.sh
```

---

## Шаг 8: Проверка работоспособности

### 8.1 Основные URL

```bash
# Главная
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/en/

# Играть бесплатно
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/en/play-free/

# Где играть
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/en/where-to-play/

# Обзор
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/en/review/

# Русская версия
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/ru/

# Админка
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/admin/login

# Sitemap
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/sitemap-index.xml

# Robots.txt
curl -s -o /dev/null -w "%{http_code}" https://bigbasscrashgame.com/robots.txt
```

Все URL должны возвращать код `200`.

### 8.2 Проверка редиректов

```bash
# HTTP -> HTTPS
curl -s -o /dev/null -w "%{http_code}" http://bigbasscrashgame.com/en/
# Ожидается: 301

# www -> без www
curl -s -o /dev/null -w "%{http_code}" https://www.bigbasscrashgame.com/en/
# Ожидается: 301

# Корень -> /en/
curl -s -o /dev/null -w "%{http_code}" -L https://bigbasscrashgame.com/
# Ожидается: 200 (после редиректа)
```

### 8.3 Мониторинг

```bash
pm2 monit                    # реал-тайм мониторинг
pm2 logs bigbasscrashgame    # логи приложения
pm2 status                   # статус
```

---

## Частые проблемы

### Ошибка "EACCES permission denied"

```bash
chown -R root:root /opt/bigbasscrashgame
chmod -R 755 /opt/bigbasscrashgame
chmod 664 /opt/bigbasscrashgame/data/database.sqlite
```

### PM2 не запускается после перезагрузки

```bash
pm2 startup
pm2 save
```

### Nginx не находит SSL сертификат

Проверьте пути к сертификатам, созданным ISPManager:

```bash
find / -name "*.crt" -path "*bigbass*" 2>/dev/null
find / -name "*.key" -path "*bigbass*" 2>/dev/null
```

### База данных заблокирована (SQLITE_BUSY)

Убедитесь что запущен только один экземпляр PM2:

```bash
pm2 list
pm2 delete all
pm2 start ecosystem.config.cjs
```

### Порт 4321 уже занят

```bash
lsof -i :4321
kill -9 PID_ПРОЦЕССА
pm2 restart bigbasscrashgame
```

---

## Полезные команды

```bash
# Генерация контента для всех языков
cd /opt/bigbasscrashgame && npx tsx scripts/generate-content.ts

# Скачать изображения
npm run fetch-images

# Пересоздать БД (ОСТОРОЖНО - удалит все данные!)
rm data/database.sqlite
npm run db:migrate
npm run db:seed

# Полная пересборка
npm run build && pm2 restart bigbasscrashgame

# Проверка размера БД
du -sh data/database.sqlite

# Бэкап БД
cp data/database.sqlite data/database.sqlite.backup.$(date +%Y%m%d)
```

---

## Структура после деплоя

```
/opt/bigbasscrashgame/
├── data/
│   └── database.sqlite       # База данных (бэкапить!)
├── dist/
│   ├── client/                # Статика (HTML, CSS, JS, images)
│   │   ├── _astro/            # Бандлы Vite
│   │   ├── en/, ru/, de/...   # HTML страницы по языкам
│   │   ├── images/game/       # Оптимизированные игровые изображения (WebP + fallback)
│   │   ├── robots.txt
│   │   ├── sitemap-index.xml
│   │   └── sitemap-0.xml
│   └── server/
│       └── entry.mjs          # Node.js сервер
├── images/                    # Исходные изображения (НЕ деплоится)
├── scripts/
│   ├── optimize-images.mjs    # Оптимизация изображений (images/ → public/images/game/)
│   └── generate-favicon.mjs   # Генерация фавиконов из логотипа
├── public/
│   └── images/                # Статические изображения
├── ecosystem.config.cjs       # PM2 конфиг
└── package.json
```

---

## Безопасность

1. **Смените пароль админки** сразу после деплоя (по умолчанию: `admin123`)
2. **Настройте файрволл**: откройте только порты 22 (SSH), 80 (HTTP), 443 (HTTPS)
3. **Регулярные бэкапы**: `data/database.sqlite` — единственный файл с данными
4. **Обновления**: периодически запускайте `apt update && apt upgrade`
5. **Мониторинг**: настройте алерты в PM2 или используйте `pm2 plus`
