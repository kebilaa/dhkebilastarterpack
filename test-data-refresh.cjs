#!/usr/bin/env node

const Database = require('better-sqlite3');

console.log('🧪 Тестирование обновления данных в таблице 31-flip...\n');

// Подключаемся к базе данных
const db = new Database('/var/www/vhosts/194.32.140.220.nip.io/ProdB/database.db');

try {
  // Проверяем текущее количество записей в таблице Scores
  const currentCount = db.prepare('SELECT COUNT(*) as count FROM Scores').get();
  console.log(`📊 Текущее количество записей в Scores: ${currentCount.count}`);
  
  // Проверяем последние записи
  const lastRecords = db.prepare(`
    SELECT 
      participant_name, 
      event_id, 
      round,
      (k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) as total_score
    FROM Scores 
    ORDER BY rowid DESC 
    LIMIT 5
  `).all();
  
  console.log('\n📋 Последние 5 записей:');
  lastRecords.forEach((record, index) => {
    console.log(`${index + 1}. ${record.participant_name} - Event ${record.event_id}, Round ${record.round}, Score: ${record.total_score}`);
  });
  
  // Проверяем уникальные event_id
  const events = db.prepare('SELECT DISTINCT event_id FROM Scores ORDER BY event_id DESC LIMIT 5').all();
  console.log('\n🎯 Последние 5 событий:');
  events.forEach((event, index) => {
    console.log(`${index + 1}. Event ID: ${event.event_id}`);
  });
  
  console.log('\n✅ Тест завершен успешно!');
  
} catch (error) {
  console.error('❌ Ошибка при тестировании:', error.message);
} finally {
  db.close();
  console.log('🔒 Соединение с базой данных закрыто');
}
