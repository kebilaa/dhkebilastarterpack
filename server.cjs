const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к базе данных
const dbPath = './ProdBy/database.db';

// Функция для получения нового соединения с БД
function getDatabase() {
  return new Database(dbPath);
}

// Проверка подключения к БД
try {
  const testDb = getDatabase();
  testDb.prepare("SELECT 1").get();
  testDb.close();
  console.log('✅ База данных подключена успешно');
} catch (error) {
  console.error('❌ Ошибка подключения к базе данных:', error);
  process.exit(1);
}

// Функция для получения данных турнира 31-flip
function getFlipData() {
  try {
    // Получаем все уникальные event_id из базы
    const events = db.prepare("SELECT DISTINCT event_id FROM Scores ORDER BY event_id DESC").all();
    
    const flipData = {
      producers: [],
      events: {}
    };

    // Для каждого события получаем данные участников
    events.forEach(event => {
      const eventId = event.event_id;
      
      // Получаем все раунды для этого события
      const rounds = db.prepare(`
        SELECT DISTINCT round 
        FROM Scores 
        WHERE event_id = ? 
        ORDER BY round
      `).all(eventId);

      const eventData = {
        id: eventId,
        name: `31-FLIP Event ${eventId.toString().slice(-4)}`,
        rounds: {}
      };

      // Для каждого раунда получаем участников и их баллы
      rounds.forEach(round => {
        const participants = db.prepare(`
          SELECT 
            participant_name as name,
            participant_id as userId,
            (k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) as score
          FROM Scores 
          WHERE event_id = ? AND round = ? AND (k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) > 0
          ORDER BY score DESC
        `).all(eventId, round.round);

        eventData.rounds[round.round] = participants.map(p => ({
          name: p.name,
          userId: p.userId.toString(),
          score: Math.round(p.score * 10) / 10
        }));
      });

      flipData.events[eventId] = eventData;

      // Собираем всех участников для общего списка
      const allParticipants = db.prepare(`
        SELECT 
          participant_name as name,
          participant_id as userId,
          SUM(k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) as totalPoints,
          COUNT(*) as totalWorks,
          AVG(k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) as avgScore
        FROM Scores 
        WHERE event_id = ? AND (k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) > 0
        GROUP BY participant_id, participant_name
        ORDER BY totalPoints DESC
      `).all(eventId);

      // Добавляем участников в общий список, если их там еще нет
      allParticipants.forEach(participant => {
        const existingProducer = flipData.producers.find(p => p.userId === participant.userId.toString());
        if (existingProducer) {
          // Обновляем существующего участника
          existingProducer.totalPoints += Math.round(participant.totalPoints * 10) / 10;
          existingProducer.totalWorks += participant.totalWorks;
          existingProducer.weightedScore = Math.round(existingProducer.totalPoints / existingProducer.totalWorks * 10) / 10;
        } else {
          // Добавляем нового участника
          flipData.producers.push({
            id: flipData.producers.length + 1,
            name: participant.name,
            userId: participant.userId.toString(),
            totalPoints: Math.round(participant.totalPoints * 10) / 10,
            weightedScore: Math.round(participant.avgScore * 10) / 10,
            totalWorks: participant.totalWorks,
            rounds: {}
          });
        }
      });
    });

    // Добавляем данные по раундам для каждого участника
    flipData.producers.forEach(producer => {
      const roundsData = db.prepare(`
        SELECT 
          event_id,
          round,
          (k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) as score
        FROM Scores 
        WHERE participant_id = ? AND (k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) > 0
        ORDER BY event_id, round
      `).all(producer.userId);

      roundsData.forEach(round => {
        const roundKey = `${round.event_id}-${round.round}`;
        producer.rounds[roundKey] = Math.round(round.score * 10) / 10;
      });
    });

    return flipData;
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return { producers: [], events: {} };
  }
}

// API маршруты
app.get('/api/flip-data', (req, res) => {
  try {
    const data = getFlipData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка API:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Функция для получения данных судей
function getJudgesData() {
  try {
    const judges = db.prepare(`
      SELECT
        s.user_name AS judge_name,
        ROUND(AVG((s.k1 + s.k2 + s.k3 + s.k4 + COALESCE(s.l, 0)) /
                  (4 + CASE WHEN s.l IS NOT NULL THEN 1 ELSE 0 END)), 2) AS avg_given_score,
        COUNT(*) AS judged_rows
      FROM Scores s
      GROUP BY s.user_name
      ORDER BY avg_given_score DESC
    `).all();

    return judges.map((judge, index) => ({
      id: index + 1,
      judge_name: judge.judge_name,
      avg_given_score: judge.avg_given_score,
      judged_rows: judge.judged_rows
    }));
  } catch (error) {
    console.error('Ошибка при получении данных судей:', error);
    return [];
  }
}

// Функция для получения данных участников (Users)
function getUsersData() {
  const db = getDatabase();
  try {
    const users = db.prepare(`
      SELECT
        u.user_name,
        u.user_team_name,
        u.kall,
        u.tall,
        u.user_team_wins,
        u.user_team_games,
        u.user_first_place,
        u.user_second_place,
        u.user_third_place,
        u.user_solo_games,
        u.l,
        u.tl
      FROM Users u
      WHERE u.user_name IS NOT NULL AND u.user_name != ''
      ORDER BY COALESCE(u.kall, 0) + COALESCE(u.tall, 0) DESC
    `).all();

    return users.map((user, index) => ({
      id: index + 1,
      user_name: user.user_name,
      team_name: user.user_team_name || '-',
      kall: user.kall || 0,
      tall: user.tall || 0,
      user_team_wins: user.user_team_wins || 0,
      user_team_games: user.user_team_games || 0,
      user_first_place: user.user_first_place || 0,
      user_second_place: user.user_second_place || 0,
      user_third_place: user.user_third_place || 0,
      user_solo_games: user.user_solo_games || 0,
      l: user.l || 0,
      tl: user.tl || 0,
      total_score: (user.kall || 0) + (user.tall || 0)
    }));
  } catch (error) {
    console.error('Ошибка при получении данных пользователей:', error);
    return [];
  } finally {
    db.close();
  }
}

app.get('/api/users-data', (req, res) => {
  try {
    const data = getUsersData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка API пользователей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/judges-data', (req, res) => {
  try {
    const data = getJudgesData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка API судей:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Функция для получения данных команд
function getTeamsData() {
  const db = getDatabase();
  try {
    const teams = db.prepare(`
      SELECT
        t.team_name,
        t.tall,
        t.team_wins,
        t.team_games,
        COUNT(DISTINCT u.user_id) as members_count
      FROM Teams t
      LEFT JOIN Users u ON u.user_team_name = t.team_name
      WHERE t.team_name IS NOT NULL AND t.team_name != ''
      GROUP BY t.team_name
      ORDER BY COALESCE(t.team_wins, 0) DESC
    `).all();

    return teams.map((team, index) => ({
      id: index + 1,
      team_name: team.team_name,
      tall: team.tall || 0,
      team_wins: team.team_wins || 0,
      team_games: team.team_games || 0,
      members_count: team.members_count || 0,
      win_rate: team.team_games > 0 ? Math.round((team.team_wins / team.team_games) * 100) / 100 : 0
    }));
  } catch (error) {
    console.error('Ошибка при получении данных команд:', error);
    return [];
  } finally {
    db.close();
  }
}

app.get('/api/teams-data', (req, res) => {
  try {
    const data = getTeamsData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка API команд:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Функция для получения данных мероприятий
function getEventsData() {
  try {
    // Получаем все уникальные мероприятия
    const events = db.prepare(`
      SELECT DISTINCT event_id, 
             'Event ' || SUBSTR(CAST(event_id AS TEXT), -4) as event_name
      FROM Scores 
      ORDER BY event_id DESC
    `).all();
    
    console.log('Events found:', events.length);

    // Получаем всех участников с их баллами по мероприятиям
    const participants = db.prepare(`
      SELECT DISTINCT 
        participant_name,
        participant_id,
        user_team_name as team_name
      FROM Scores 
      ORDER BY participant_name
    `).all();

    console.log('Participants found:', participants.length);

    // Создаем структуру данных
    const eventsData = {
      events: events.map(event => ({
        id: event.event_id,
        name: event.event_name
      })),
      participants: participants.map(participant => {
        const participantData = {
          id: participant.participant_id,
          name: participant.participant_name,
          team: participant.team_name || '-',
          events: {}
        };

        // Получаем баллы участника по всем мероприятиям
        const scores = db.prepare(`
          SELECT 
            event_id,
            round,
            (k1 + k2 + k3 + k4 + COALESCE(l, 0) + t1 + t2 + t3 + t4 + t5 + t6 + t7 + COALESCE(tl, 0)) as total_score
          FROM Scores 
          WHERE participant_id = ? 
          ORDER BY event_id, round
        `).all(participant.participant_id);

        // Группируем баллы по мероприятиям
        scores.forEach(score => {
          const eventKey = score.event_id;
          if (!participantData.events[eventKey]) {
            participantData.events[eventKey] = {
              total: 0,
              rounds: [],
              avg: 0
            };
          }
          participantData.events[eventKey].total += score.total_score;
          participantData.events[eventKey].rounds.push({
            round: score.round,
            score: Math.round(score.total_score * 10) / 10
          });
        });

        // Вычисляем средний балл для каждого мероприятия
        Object.keys(participantData.events).forEach(eventKey => {
          const eventData = participantData.events[eventKey];
          eventData.avg = eventData.rounds.length > 0 
            ? Math.round((eventData.total / eventData.rounds.length) * 10) / 10 
            : 0;
        });

        return participantData;
      })
    };

    console.log('Returning eventsData:', eventsData.events.length, 'events,', eventsData.participants.length, 'participants');
    return eventsData;
  } catch (error) {
    console.error('Ошибка при получении данных мероприятий:', error);
    return { events: [], participants: [] };
  }
}

app.get('/api/events-data', (req, res) => {
  try {
    console.log('API events-data called');
    const data = getEventsData();
    console.log('Data returned:', data);
    res.json(data);
  } catch (error) {
    console.error('Ошибка API мероприятий:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Простой тест для отладки
app.get('/api/test-events', (req, res) => {
  try {
    const events = db.prepare(`
      SELECT DISTINCT event_id, 
             'Event ' || SUBSTR(CAST(event_id AS TEXT), -4) as event_name
      FROM Scores 
      ORDER BY event_id DESC
      LIMIT 3
    `).all();
    
    console.log('Test events:', events);
    res.json({ events, count: events.length });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Функция для получения истории участия участника
function getParticipantHistory(participantName) {
  try {
    const history = db.prepare(`
      WITH rows AS (
        SELECT
          s.event_id,
          s.round,
          s."participant _id" AS participant_id,
          s.participant_name,
          s.participant_team,
          s.user_name AS judge_name,
          s.date,
          s.time,
          (
            (s.k1 + s.k2 + s.k3 + s.k4 + COALESCE(s.l, 0))
            / (4 + CASE WHEN s.l IS NOT NULL THEN 1 ELSE 0 END)
          ) AS row_score,
          (SUBSTR(s.date,7,4) || '-' || SUBSTR(s.date,4,2) || '-' || SUBSTR(s.date,1,2)) AS event_dt
        FROM Scores s
        WHERE s.participant_name = ?
      )
      SELECT
        event_id,
        round,
        participant_name,
        participant_team,
        ROUND(AVG(row_score), 2) AS avg_score,
        COUNT(*) AS judges_count,
        MIN(event_dt) AS event_date,
        GROUP_CONCAT(DISTINCT judge_name) AS judges
      FROM rows
      GROUP BY event_id, round, participant_name, participant_team
      ORDER BY event_date DESC
    `).all(participantName);

    return history;
  } catch (error) {
    console.error('Ошибка при получении истории участника:', error);
    return [];
  }
}

// Функция для получения истории судейства судьи
function getJudgeHistory(judgeName) {
  try {
    const history = db.prepare(`
      SELECT
        x.event_id,
        x.round,
        x.date,
        x.time,
        x.judge_name,
        ROUND(x.row_score, 2) AS score,
        x.k1, x.k2, x.k3, x.k4, x.l
      FROM (
        SELECT
          s.event_id,
          s.round,
          s.date,
          s.time,
          s.user_name AS judge_name,
          s.k1, s.k2, s.k3, s.k4, s.l,
          (
            (s.k1 + s.k2 + s.k3 + s.k4 + COALESCE(s.l, 0))
            / (4 + CASE WHEN s.l IS NOT NULL THEN 1 ELSE 0 END)
          ) AS row_score,
          (SUBSTR(s.date,7,4) || '-' || SUBSTR(s.date,4,2) || '-' || SUBSTR(s.date,1,2)) AS event_dt
        FROM Scores s
        WHERE s.user_name = ?
      ) AS x
      ORDER BY x.event_dt DESC, x.time DESC, x.judge_name
    `).all(judgeName);

    return history;
  } catch (error) {
    console.error('Ошибка при получении истории судьи:', error);
    return [];
  }
}

app.get('/api/participant-history/:name', (req, res) => {
  try {
    const participantName = decodeURIComponent(req.params.name);
    const data = getParticipantHistory(participantName);
    res.json(data);
  } catch (error) {
    console.error('Ошибка API истории участника:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/judge-history/:name', (req, res) => {
  try {
    const judgeName = decodeURIComponent(req.params.name);
    const data = getJudgeHistory(judgeName);
    res.json(data);
  } catch (error) {
    console.error('Ошибка API истории судьи:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Функция для получения данных FUsers
function getFUsersData() {
  const db = getDatabase();
  try {
    const users = db.prepare(`
      SELECT 
        user_name,
        user_team_name,
        l,
        tl
      FROM FUsers 
      WHERE user_name IS NOT NULL AND user_name != ''
      ORDER BY COALESCE(l, 0) DESC, COALESCE(tl, 0) DESC
    `).all();

    return users.map((user, index) => ({
      id: index + 1,
      username: user.user_name,
      team_name: user.user_team_name || '-',
      l: user.l || 0,
      tl: user.tl || 0
    }));
  } catch (error) {
    console.error('Ошибка при получении данных FUsers:', error);
    return [];
  } finally {
    db.close();
  }
}

app.get('/api/fusers-data', (req, res) => {
  try {
    const data = getFUsersData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка API FUsers:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

// Функция для получения данных мероприятий
function getEventsData() {
  const db = getDatabase();
  try {
    // Получаем все уникальные мероприятия
    const events = db.prepare(`
      SELECT DISTINCT 
        CAST(event_id AS TEXT) as event_id,
        date,
        game_type
      FROM Scores 
      ORDER BY event_id DESC
    `).all();

    const eventsData = events.map(event => {
      // Определяем тип игры
      const gameTypeNames = {
        1: 'main',
        2: 'team main', 
        3: 'free',
        4: 'free team'
      };
      
      const gameTypeName = gameTypeNames[event.game_type] || 'unknown';

      // Получаем всех участников с их баллами по раундам
      const participants = db.prepare(`
        SELECT 
          participant_name,
          round,
          l,
          t1, t2, t3, t4, t5, t6, t7, tl,
          user_name
        FROM Scores 
        WHERE event_id = ? AND participant_name IS NOT NULL
        ORDER BY participant_name, round
      `).all(event.event_id);

      // Группируем участников и их раунды
      const participantsMap = {};
      const participantTotals = {};
      const participantRounds = {};
      
      participants.forEach(p => {
        if (!participantsMap[p.participant_name]) {
          participantsMap[p.participant_name] = {};
          participantTotals[p.participant_name] = 0;
          participantRounds[p.participant_name] = {};
        }
        
        // Вычисляем балл для раунда от конкретного судьи
        let judgeScore = 0;
        if (event.game_type === 1 || event.game_type === 3) {
          // Для main и free используем l
          judgeScore = p.l || 0;
        } else {
          // Для team main и free team используем сумму t1-t7 + tl
          judgeScore = (p.t1 || 0) + (p.t2 || 0) + (p.t3 || 0) + (p.t4 || 0) + 
                      (p.t5 || 0) + (p.t6 || 0) + (p.t7 || 0) + (p.tl || 0);
        }
        
        // Суммируем оценки от всех судей для участника в раунде
        if (!participantRounds[p.participant_name][p.round]) {
          participantRounds[p.participant_name][p.round] = 0;
        }
        participantRounds[p.participant_name][p.round] += judgeScore;
      });

      // Переносим данные в participantsMap и считаем общие баллы
      Object.keys(participantRounds).forEach(participantName => {
        Object.keys(participantRounds[participantName]).forEach(round => {
          const roundScore = participantRounds[participantName][round];
          participantsMap[participantName][round] = roundScore;
          participantTotals[participantName] += roundScore;
        });
      });

      // Получаем все раунды для этого мероприятия
      const rounds = [...new Set(participants.map(p => p.round))].sort();

      // Находим победителя (участника с максимальным общим баллом)
      let winner = 'Не определен';
      let maxScore = 0;
      Object.keys(participantTotals).forEach(name => {
        if (participantTotals[name] > maxScore) {
          maxScore = participantTotals[name];
          winner = name;
        }
      });

      return {
        id: event.event_id.toString(),
        date: event.date,
        game_type: event.game_type,
        game_type_name: gameTypeName,
        winner: winner,
        rounds: rounds,
        participants: Object.keys(participantsMap).map(name => ({
          name: name,
          scores: participantsMap[name],
          total: participantTotals[name]
        }))
      };
    });

    return eventsData;
  } catch (error) {
    console.error('Ошибка при получении данных мероприятий:', error);
    return [];
  } finally {
    db.close();
  }
}

app.get('/api/events-data', (req, res) => {
  try {
    const data = getEventsData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка API мероприятий:', error);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API сервер работает' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`API сервер запущен на порту ${PORT}`);
  console.log(`Доступен по адресу: http://localhost:${PORT}`);
});
