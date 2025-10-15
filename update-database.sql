-- Скрипт обновления структуры базы данных Digital Hustlas
-- Убираем приставки user_/team_ и добавляем новые поля

-- Обновляем таблицу Users
-- Переименовываем колонки, убирая приставку user_
ALTER TABLE Users RENAME COLUMN user_k1 TO k1;
ALTER TABLE Users RENAME COLUMN user_k2 TO k2;
ALTER TABLE Users RENAME COLUMN user_k3 TO k3;
ALTER TABLE Users RENAME COLUMN user_k4 TO k4;
ALTER TABLE Users RENAME COLUMN user_l TO l;
ALTER TABLE Users RENAME COLUMN user_t1 TO t1;
ALTER TABLE Users RENAME COLUMN user_t2 TO t2;
ALTER TABLE Users RENAME COLUMN user_t3 TO t3;
ALTER TABLE Users RENAME COLUMN user_t4 TO t4;
ALTER TABLE Users RENAME COLUMN user_t5 TO t5;
ALTER TABLE Users RENAME COLUMN user_t6 TO t6;
ALTER TABLE Users RENAME COLUMN user_t7 TO t7;
ALTER TABLE Users RENAME COLUMN user_tl TO tl;

-- Добавляем новые поля для Users
ALTER TABLE Users ADD COLUMN kall REAL DEFAULT 0.0; -- общая ср. оценка main event
ALTER TABLE Users ADD COLUMN tall REAL DEFAULT 0.0; -- общая ср. оценка team event

-- Добавляем поля для статистики (пока NULL, будут заполнены позже)
ALTER TABLE Users ADD COLUMN user_team_wins INTEGER DEFAULT 0; -- кол-во побед в командных раундах за последний месяц
ALTER TABLE Users ADD COLUMN user_team_games INTEGER DEFAULT 0; -- кол-во участий в командных раундах за последний месяц
ALTER TABLE Users ADD COLUMN user_solo_wins INTEGER DEFAULT 0; -- кол-во побед в обычных раундах за последний месяц
ALTER TABLE Users ADD COLUMN user_solo_games INTEGER DEFAULT 0; -- кол-во участий в обычных раундах за последний месяц

-- Обновляем таблицу Teams
-- Переименовываем колонки, убирая приставку team_
ALTER TABLE Teams RENAME COLUMN team_t1 TO t1;
ALTER TABLE Teams RENAME COLUMN team_t2 TO t2;
ALTER TABLE Teams RENAME COLUMN team_t3 TO t3;
ALTER TABLE Teams RENAME COLUMN team_t4 TO t4;
ALTER TABLE Teams RENAME COLUMN team_t5 TO t5;
ALTER TABLE Teams RENAME COLUMN team_t6 TO t6;
ALTER TABLE Teams RENAME COLUMN team_t7 TO t7;
ALTER TABLE Teams RENAME COLUMN team_tl TO tl;

-- Добавляем новые поля для Teams
ALTER TABLE Teams ADD COLUMN tall REAL DEFAULT 0.0; -- общая ср. оценка team event

-- Добавляем поля для статистики команд (пока NULL, будут заполнены позже)
ALTER TABLE Teams ADD COLUMN team_wins INTEGER DEFAULT 0; -- кол-во побед команды за последний месяц
ALTER TABLE Teams ADD COLUMN team_games INTEGER DEFAULT 0; -- кол-во участий команды за последний месяц

-- Создаем индексы для новых полей (для оптимизации запросов)
CREATE INDEX IF NOT EXISTS idx_users_kall ON Users(kall);
CREATE INDEX IF NOT EXISTS idx_users_tall ON Users(tall);
CREATE INDEX IF NOT EXISTS idx_users_team_wins ON Users(user_team_wins);
CREATE INDEX IF NOT EXISTS idx_users_team_games ON Users(user_team_games);
CREATE INDEX IF NOT EXISTS idx_users_solo_wins ON Users(user_solo_wins);
CREATE INDEX IF NOT EXISTS idx_users_solo_games ON Users(user_solo_games);

CREATE INDEX IF NOT EXISTS idx_teams_tall ON Teams(tall);
CREATE INDEX IF NOT EXISTS idx_teams_wins ON Teams(team_wins);
CREATE INDEX IF NOT EXISTS idx_teams_games ON Teams(team_games);

-- Обновляем данные: вычисляем kall и tall для существующих записей
-- kall = среднее от k1, k2, k3, k4, l
UPDATE Users SET kall = (k1 + k2 + k3 + k4 + COALESCE(l, 0)) / (4 + CASE WHEN l IS NOT NULL THEN 1 ELSE 0 END) 
WHERE k1 IS NOT NULL AND k2 IS NOT NULL AND k3 IS NOT NULL AND k4 IS NOT NULL;

-- tall = среднее от t1, t2, t3, t4, t5, t6, t7, tl
UPDATE Users SET tall = (t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) / (7 + CASE WHEN tl IS NOT NULL THEN 1 ELSE 0 END)
WHERE t1 IS NOT NULL AND t2 IS NOT NULL AND t3 IS NOT NULL AND t4 IS NOT NULL AND t5 IS NOT NULL AND t6 IS NOT NULL AND t7 IS NOT NULL;

-- tall для команд = среднее от t1, t2, t3, t4, t5, t6, t7, tl
UPDATE Teams SET tall = (t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) / (7 + CASE WHEN tl IS NOT NULL THEN 1 ELSE 0 END)
WHERE t1 IS NOT NULL AND t2 IS NOT NULL AND t3 IS NOT NULL AND t4 IS NOT NULL AND t5 IS NOT NULL AND t6 IS NOT NULL AND t7 IS NOT NULL;

-- Выводим информацию об обновлении
SELECT 'Database structure updated successfully!' as status;
SELECT 'Users table columns:' as info;
PRAGMA table_info(Users);
SELECT 'Teams table columns:' as info;
PRAGMA table_info(Teams);
