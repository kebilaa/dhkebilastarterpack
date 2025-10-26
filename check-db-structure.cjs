const Database = require('better-sqlite3');

// Подключаемся к базе данных
const db = new Database('/home/ubuntu/ProdBy/database.db');

console.log('🗄️ Структура базы данных Digital Hustlas\n');

try {
  // Получаем список всех таблиц
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  
  console.log('📋 Таблицы в базе данных:');
  tables.forEach(table => {
    console.log(`  - ${table.name}`);
  });
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Для каждой таблицы показываем структуру
  tables.forEach(table => {
    console.log(`📊 Структура таблицы: ${table.name}`);
    console.log('-'.repeat(30));
    
    const columns = db.prepare(`PRAGMA table_info(${table.name})`).all();
    
    columns.forEach(col => {
      const nullable = col.notnull === 0 ? 'NULL' : 'NOT NULL';
      const pk = col.pk === 1 ? ' (PRIMARY KEY)' : '';
      const defaultVal = col.dflt_value ? ` DEFAULT ${col.dflt_value}` : '';
      
      console.log(`  ${col.name}: ${col.type} ${nullable}${defaultVal}${pk}`);
    });
    
    // Показываем количество записей
    const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
    console.log(`  📈 Записей: ${count.count}`);
    
    console.log('\n');
  });
  
  // Показываем примеры данных для основных таблиц
  const mainTables = ['Users', 'Teams', 'Scores'];
  
  mainTables.forEach(tableName => {
    if (tables.some(t => t.name === tableName)) {
      console.log(`🔍 Пример данных из таблицы ${tableName}:`);
      console.log('-'.repeat(30));
      
      const sample = db.prepare(`SELECT * FROM ${tableName} LIMIT 3`).all();
      if (sample.length > 0) {
        console.log(JSON.stringify(sample, null, 2));
      } else {
        console.log('  (таблица пуста)');
      }
      console.log('\n');
    }
  });
  
} catch (error) {
  console.error('❌ Ошибка при чтении базы данных:', error.message);
} finally {
  db.close();
}

console.log('✅ Проверка структуры завершена');
