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
const db = new Database('./database.db');

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
            (k1 + k2 + k3 + k4 + l + t1 + t2 + t3 + t4 + t5 + t6 + t7 + tl) as score
          FROM Scores 
          WHERE event_id = ? AND round = ? AND score > 0
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
          SUM(k1 + k2 + k3 + k4 + l + t1 + t2 + t3 + t4 + t5 + t6 + t7 + tl) as totalPoints,
          COUNT(*) as totalWorks,
          AVG(k1 + k2 + k3 + k4 + l + t1 + t2 + t3 + t4 + t5 + t6 + t7 + tl) as avgScore
        FROM Scores 
        WHERE event_id = ? AND (k1 + k2 + k3 + k4 + l + t1 + t2 + t3 + t4 + t5 + t6 + t7 + tl) > 0
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
          (k1 + k2 + k3 + k4 + l + t1 + t2 + t3 + t4 + t5 + t6 + t7 + tl) as score
        FROM Scores 
        WHERE participant_id = ? AND (k1 + k2 + k3 + k4 + l + t1 + t2 + t3 + t4 + t5 + t6 + t7 + tl) > 0
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

// Функция для получения данных участников
function getParticipantsData() {
  try {
    const participants = db.prepare(`
      SELECT
        u.user_name AS participant_name,
        u.user_team_name AS team_name,
        ROUND(AVG((s.k1 + s.k2 + s.k3 + s.k4 + COALESCE(s.l, 0)) /
                  (4 + CASE WHEN s.l IS NOT NULL THEN 1 ELSE 0 END)), 2) AS avg_score
      FROM Users u
      LEFT JOIN Scores s
          ON s."participant _id" = u.user_id
      GROUP BY u.user_name, u.user_team_name
      ORDER BY avg_score DESC
    `).all();

    return participants.map((participant, index) => ({
      id: index + 1,
      participant_name: participant.participant_name,
      team_name: participant.team_name,
      avg_score: participant.avg_score
    }));
  } catch (error) {
    console.error('Ошибка при получении данных участников:', error);
    return [];
  }
}

app.get('/api/participants-data', (req, res) => {
  try {
    const data = getParticipantsData();
    res.json(data);
  } catch (error) {
    console.error('Ошибка API участников:', error);
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API сервер работает' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`API сервер запущен на порту ${PORT}`);
  console.log(`Доступен по адресу: http://localhost:${PORT}`);
});
