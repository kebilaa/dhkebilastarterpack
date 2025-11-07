const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const distPath = path.join(__dirname, 'dist');

// Список расширений статических файлов
const staticExtensions = ['.js', '.mjs', '.css', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.mp4', '.webm', '.csv', '.pdf'];

// Middleware для обработки статических файлов с правильными MIME-типами
app.use((req, res, next) => {
  const isStaticFile = staticExtensions.some(ext => req.path.endsWith(ext));
  
  if (isStaticFile) {
    // Проверяем, существует ли файл
    const filePath = path.join(distPath, req.path);
    
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      // Устанавливаем правильные MIME-типы
      if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
        res.type('application/javascript; charset=utf-8');
      } else if (req.path.endsWith('.css')) {
        res.type('text/css; charset=utf-8');
      } else if (req.path.endsWith('.json')) {
        res.type('application/json; charset=utf-8');
      }
      // Отдаем файл напрямую
      return res.sendFile(filePath);
    } else {
      // Файл не найден - возвращаем 404
      return res.status(404).send('File not found');
    }
  }
  
  next();
});

// Раздаем остальные статические файлы из папки dist
app.use(express.static(distPath, {
  index: false,
  fallthrough: true
}));

// SPA fallback: для всех остальных запросов возвращаем index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Веб-сервер запущен на порту ${PORT}`);
  console.log(`📁 Раздает файлы из: ${path.join(__dirname, 'dist')}`);
});

