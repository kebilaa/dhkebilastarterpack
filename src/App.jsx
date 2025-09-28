import React, { useEffect, useMemo, useState } from "react";
import { realProducers, eventData } from "./data.js";

// DIGITAL HUSTLAS — Minimal Neon UI Prototype
// Dark theme + neon accents, big type, minimal layout. Single-file SPA with tabs.
// Tailwind is available in canvas; no imports needed.

// ---- THEME ----
const COLORS = {
  bg: "#0A0A0A",
  text: "#FFFFFF",
  neon1: "#A020F0", // purple
  neon2: "#00FFFF", // cyan
  neon3: "#FF007F", // pink
  neon4: "#00FF41", // neon green
  muted: "#9CA3AF",
  card: "#111111", 
  border: "#1F2937",
};

// Data imported from data.js

function sum(arr) { return arr.reduce((a, b) => a + b, 0); }

// ---- UTILS ----
function cx(...args) { return args.filter(Boolean).join(" "); }

function glow(style = 1) {
  // Creates a neon box/outer glow via Tailwind arbitrary shadows
  const color = style === 1 ? COLORS.neon2 : style === 2 ? COLORS.neon1 : COLORS.neon3;
  return `shadow-[0_0_20px_${color}40]`;
}

function LivePill() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-300"></span>
      </span>
      <span className="text-xs tracking-widest text-cyan-300/90">LIVE</span>
    </div>
  );
}

function NeonButton({ children, onClick, variant = "primary" }) {
  const base = "px-5 py-3 rounded-2xl font-semibold tracking-wide transition-transform active:scale-95";
  const palette =
    variant === "primary"
      ? `bg-[${COLORS.card}] border border-[${COLORS.neon2}] text-white ${glow(1)}`
      : variant === "pink"
      ? `bg-[${COLORS.card}] border border-[${COLORS.neon3}] text-white ${glow(3)}`
      : `bg-[${COLORS.card}] border border-[${COLORS.neon1}] text-white ${glow(2)}`;
  return (
    <button onClick={onClick} className={cx(base, palette)}>
      {children}
    </button>
  );
}

function Avatar({ label }) {
  return (
    <div
      className={cx(
        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
        `bg-[${COLORS.card}] border border-[${COLORS.border}] text-white`
      )}
      style={{ boxShadow: `0 0 16px ${COLORS.neon1}33` }}
    >
      {label}
    </div>
  );
}

// ---- PAGES ----
function Home({ onNavigate, top3 }) {
  return (
    <div className="p-6 md:p-10">
      <section className="relative min-h-[40vh] flex flex-col items-start justify-center gap-6 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={`${import.meta.env.BASE_URL}back.mp4`} type="video/mp4" />
          </video>
          {/* Shadow Overlay */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-7xl font-extrabold leading-tight">
            DIGITAL HUSTLAS
          </h1>
        </div>
        
        {/* Gradient Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-black/80"></div>
      </section>

      {/* Twitch Stream Section */}
      <section className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <LivePill />
          <h2 className="text-2xl md:text-3xl font-bold">Трансляция Twitch</h2>
        </div>
        <div className={cx("rounded-3xl border p-6", glow(1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <div className="aspect-video w-full rounded-2xl bg-black/40 grid place-items-center text-gray-500 border border-[#1F2937]">
            <div className="text-center">
              <div className="text-2xl mb-2">🎮</div>
              <div className="text-sm">Здесь будет встраивание Twitch виджета</div>
              <div className="text-xs text-gray-600 mt-1">Трансляции турниров, стримы продюсеров, live сессии</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <span className="text-cyan-300 font-semibold">LIVE</span> • Стрим турнира 31-FLIP • 127 зрителей
            </div>
            <button className="px-4 py-2 rounded-xl bg-[#0F0F10] border border-[#1F2937] text-sm hover:border-cyan-300 transition-colors">
              Открыть на Twitch
            </button>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Топ‑3 в 31-FLIP прямо сейчас</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {top3.map((p, i) => (
            <div key={p.id} className={cx("p-6 rounded-3xl border", glow(i === 0 ? 2 : i === 1 ? 1 : 3))} style={{
              background: COLORS.card,
              borderColor: COLORS.border,
            }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#111111] border border-[#1F2937] flex items-center justify-center text-sm font-bold text-white">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="text-lg font-semibold">{i + 1}. {p.name}</div>
                  <div className="text-sm text-gray-400">ID: {p.userId.slice(-6)}</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-extrabold">{p.totalPoints}</div>
                  <div className="text-xs text-gray-400">баллов</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { k: "flip", t: "31‑FLIP", d: "Турнир: раунды, таблица, профили" },
          { k: "media", t: "Media", d: "Radio, релизы, плейлисты" },
          { k: "prod", t: "prod.by", d: "Закрытое комьюнити по подписке" },
          { k: "discord", t: "Discord", d: "Присоединяйся к комьюнити" },
        ].map((card, idx) => (
          <button key={card.k} onClick={() => onNavigate(card.k)} className={cx(
            "text-left p-6 rounded-3xl border transition-transform hover:-translate-y-0.5",
            glow((idx % 3) + 1)
          )} style={{ background: COLORS.card, borderColor: COLORS.border }}>
            <div className="text-xl font-bold mb-2">{card.t}</div>
            <div className="text-gray-400">{card.d}</div>
          </button>
        ))}
      </section>
    </div>
  );
}

function FlipLeaderboard({ data, onOpenProducer }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const list = data.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    return list.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [data, query]);

  // Get all unique round keys for column headers
  const allRounds = useMemo(() => {
    const rounds = new Set();
    data.forEach(producer => {
      Object.keys(producer.rounds).forEach(round => rounds.add(round));
    });
    return Array.from(rounds).sort();
  }, [data]);

  return (
    <div className="p-6 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 mb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">31‑FLIP — Таблица</h1>
          <div className="mt-2 text-gray-400 flex items-center gap-3"><LivePill /><span>Обновляется в реальном времени</span></div>
        </div>
        <div className="md:ml-auto flex items-center gap-3">
          <input
            placeholder="Поиск продюсера"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-[#0F0F10] border border-[#1F2937] outline-none min-w-[220px]"
          />
        </div>
      </div>

      <div className="rounded-3xl border overflow-hidden" style={{ background: COLORS.card, borderColor: COLORS.border }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs md:text-sm uppercase tracking-wider text-gray-400">
                <th className="p-2 md:p-4 sticky left-0 bg-[#111111] z-10 w-12">#</th>
                <th className="p-2 md:p-4 sticky left-12 bg-[#111111] z-10 w-24 md:w-32">Имя</th>
                <th className="p-2 md:p-4 sticky left-36 md:left-44 bg-[#111111] z-10 w-16 md:w-20 text-xs">ID</th>
                <th className="p-2 md:p-4 sticky left-52 md:left-64 bg-[#111111] z-10 w-12 md:w-16 text-xs">Баллы</th>
                <th className="p-2 md:p-4 sticky left-64 md:left-80 bg-[#111111] z-10 w-12 md:w-16 text-xs">Вес</th>
                <th className="p-2 md:p-4 sticky left-76 md:left-96 bg-[#111111] z-10 w-12 md:w-16 text-xs">Работ</th>
                {allRounds.map((round, idx) => (
                  <th key={round} className="p-1 md:p-4 min-w-[60px] md:min-w-[120px] text-center">
                    <div className="text-xs md:text-sm">{round.split('-')[0].slice(-4)}</div>
                    <div className="text-xs">R{round.split('Round ')[1]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p.id} className={cx("border-t border-[#1F2937] hover:bg-[#0E0E10] cursor-pointer", idx < 10 && glow(idx === 0 ? 2 : idx === 1 ? 1 : idx === 2 ? 3 : 0))} onClick={() => onOpenProducer(p)}>
                  <td className="p-2 md:p-4 font-bold sticky left-0 bg-[#111111] z-10 text-xs md:text-sm">{idx + 1}</td>
                  <td className="p-2 md:p-4 sticky left-12 bg-[#111111] z-10 font-semibold text-xs md:text-sm truncate" title={p.name}>{p.name}</td>
                  <td className="p-2 md:p-4 sticky left-36 md:left-44 bg-[#111111] z-10 text-xs text-gray-400 font-mono">{p.userId.slice(-4)}</td>
                  <td className="p-2 md:p-4 sticky left-52 md:left-64 bg-[#111111] z-10 font-semibold text-xs md:text-sm">{p.totalPoints}</td>
                  <td className="p-2 md:p-4 sticky left-64 md:left-80 bg-[#111111] z-10 font-semibold text-xs md:text-sm">{p.weightedScore}</td>
                  <td className="p-2 md:p-4 sticky left-76 md:left-96 bg-[#111111] z-10 font-semibold text-xs md:text-sm">{p.totalWorks}</td>
                  {allRounds.map((round) => (
                    <td key={round} className="p-1 md:p-4 text-center">
                      {p.rounds[round] ? (
                        <span className="px-1 md:px-2 py-1 rounded bg-[#0F0F10] border border-[#1F2937] text-xs">
                          {p.rounds[round]}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-xs">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={cx("p-6 rounded-3xl border", glow(2))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <div className="text-xl font-bold mb-2">Календарь раундов</div>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>Неделя 1 — Отборочный раунд (прошёл)</li>
            <li>Неделя 2 — Темп 140 BPM, Тональность Am (прошёл)</li>
            <li>Неделя 3 — Сампл: Soul 70s (прошёл)</li>
            <li>Неделя 4 — Финал: Ограничение 30 мин (скоро)</li>
          </ul>
        </div>
        <div className={cx("p-6 rounded-3xl border", glow(1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <div className="text-xl font-bold mb-2">Правила 31‑FLIP</div>
          <ul className="text-gray-300 text-sm list-disc pl-5 space-y-2">
            <li>30 минут на бит из выбранного сэмпла</li>
            <li>Судьи + слушатели голосуют, начисляются баллы</li>
            <li>Запрещён плагиат и сторонние заготовки</li>
            <li>Публикация результата в строгий дедлайн</li>
          </ul>
        </div>
        <div className={cx("p-6 rounded-3xl border", glow(3))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <div className="text-xl font-bold mb-2">Архив сезонов</div>
          <div className="text-gray-300 text-sm">Сезон 1: победитель — Bytewave. Полная статистика и треки доступны в архиве.</div>
        </div>
      </div>
    </div>
  );
}

function ProducerModal({ producer, isOpen, onClose, onOpenEvent }) {
  if (!isOpen || !producer) return null;

  const events = useMemo(() => {
    const eventMap = new Map();
    Object.keys(producer.rounds).forEach(roundKey => {
      const eventId = roundKey.split('-Round')[0];
      if (!eventMap.has(eventId)) {
        eventMap.set(eventId, {
          id: eventId,
          name: eventData[eventId]?.name || `Мероприятие ${eventId.slice(-4)}`,
          rounds: []
        });
      }
      eventMap.get(eventId).rounds.push({
        name: roundKey,
        score: producer.rounds[roundKey]
      });
    });
    return Array.from(eventMap.values());
  }, [producer]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] rounded-3xl border border-[#1F2937] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#1F2937] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{producer.name}</h2>
            <div className="text-gray-400 text-sm">ID: {producer.userId}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0F0F10] border border-[#1F2937] hover:border-cyan-300 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 rounded-2xl bg-[#0F0F10] border border-[#1F2937]">
              <div className="text-2xl font-bold text-cyan-300">{producer.totalPoints}</div>
              <div className="text-sm text-gray-400">Итого баллов</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-[#0F0F10] border border-[#1F2937]">
              <div className="text-2xl font-bold text-purple-300">{producer.weightedScore}</div>
              <div className="text-sm text-gray-400">Взвешенный балл</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-[#0F0F10] border border-[#1F2937]">
              <div className="text-2xl font-bold text-pink-300">{producer.totalWorks}</div>
              <div className="text-sm text-gray-400">Итого работ</div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">История участий</h3>
            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="p-4 rounded-2xl bg-[#0F0F10] border border-[#1F2937]">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{event.name}</h4>
                    <button
                      onClick={() => onOpenEvent(event.id)}
                      className="px-3 py-1 rounded-lg bg-[#111111] border border-[#1F2937] text-sm hover:border-cyan-300 transition-colors"
                    >
                      Подробнее
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {event.rounds.map(round => (
                      <div key={round.name} className="text-center p-2 rounded-lg bg-[#111111]">
                        <div className="text-xs text-gray-400">R{round.name.split('Round ')[1]}</div>
                        <div className="font-semibold">{round.score}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Event Modal Component
function EventModal({ eventId, isOpen, onClose }) {
  if (!isOpen || !eventId || !eventData[eventId]) return null;

  const event = eventData[eventId];
  const rounds = Object.keys(event.rounds);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111111] rounded-3xl border border-[#1F2937] max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#1F2937] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{event.name}</h2>
            <div className="text-gray-400 text-sm">ID: {eventId}</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#0F0F10] border border-[#1F2937] hover:border-cyan-300 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs uppercase tracking-wider text-gray-400">
                  <th className="p-3 sticky left-0 bg-[#111111] z-10">#</th>
                  <th className="p-3 sticky left-12 bg-[#111111] z-10">Участник</th>
                  <th className="p-3 sticky left-32 bg-[#111111] z-10">ID</th>
                  {rounds.map(round => (
                    <th key={round} className="p-3 text-center min-w-[80px]">
                      <div className="text-xs">{round}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {event.rounds[rounds[0]]?.map((participant, idx) => (
                  <tr key={participant.userId} className="border-t border-[#1F2937] hover:bg-[#0E0E10]">
                    <td className="p-3 sticky left-0 bg-[#111111] z-10 font-bold text-sm">{idx + 1}</td>
                    <td className="p-3 sticky left-12 bg-[#111111] z-10 font-semibold text-sm">{participant.name}</td>
                    <td className="p-3 sticky left-32 bg-[#111111] z-10 text-xs text-gray-400 font-mono">{participant.userId.slice(-4)}</td>
                    {rounds.map(round => {
                      const roundData = event.rounds[round].find(p => p.userId === participant.userId);
                      return (
                        <td key={round} className="p-3 text-center">
                          {roundData ? (
                            <span className="px-2 py-1 rounded bg-[#0F0F10] border border-[#1F2937] text-sm">
                              {roundData.score}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function stability(arr) {
  const avg = sum(arr) / arr.length;
  const variance = arr.reduce((acc, v) => acc + Math.pow(v - avg, 2), 0) / arr.length;
  const std = Math.sqrt(variance);
  const score = Math.max(0, 100 - Math.min(100, (std / (avg || 1)) * 100));
  return Math.round(score);
}

function Radio() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3 mb-4"><LivePill /><span className="text-gray-400">YouTube Live</span></div>
      <h1 className="text-3xl md:text-5xl font-extrabold">Digital Hustlas Radio</h1>
      <p className="mt-3 text-gray-300 max-w-2xl">Стримим отобранные модераторами треки и биты из закрытой группы prod.by.</p>

      <div className={cx("mt-8 rounded-3xl border p-6", glow(1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
        <div className="aspect-video w-full rounded-2xl bg-black/40 grid place-items-center text-gray-500">
          <span>Здесь будет встраивание YouTube‑плеера</span>
        </div>
      </div>

      <div className="mt-10 hidden">
        <h2 className="text-2xl font-bold mb-4">Архив эфиров</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {new Array(6).fill(0).map((_, i) => (
            <div key={i} className="p-4 rounded-3xl border" style={{ background: COLORS.card, borderColor: COLORS.border }}>
              <div className="aspect-video rounded-2xl bg-black/40 mb-3" />
              <div className="font-semibold">Выпуск #{i + 1}</div>
              <div className="text-sm text-gray-400">Подборка жанров: rap, electronic</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProdBy() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl md:text-5xl font-extrabold">prod.by</h1>
      <p className="mt-3 text-gray-300 max-w-2xl">Ежемесячная подписка: доступ к закрытому чату, доступ к турнирам, киты, советы по звукорежиссуре и многое другое.</p>
      <div className="mt-6 flex gap-4">
        <NeonButton>Оформить подписку</NeonButton>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Разделы</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Треки, биты, электронная музыка", desc: "" },
            { title: "Инструменты", desc: "Киты, лупы, звукорежиссура" },
            { title: "Релизы", desc: "Публикация релизов" }
          ].map((section, i) => (
            <div key={i} className={cx("p-6 rounded-3xl border", glow((i % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
              <div className="text-xl font-bold mb-2">{section.title}</div>
              {section.desc && <div className="text-gray-300 text-sm">{section.desc}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Releases() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl md:text-5xl font-extrabold">Releases</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {[
          { title: "PLAYBOOKIE PLAYMAKERAH vol.1", link: "https://band.link/playbookie", cover: "pp.jpg" },
          { title: "Late Night Phone Calls vol.1", link: "https://band.link/late_night_phone", cover: "lnpc.jpg" },
          { title: "Archive 1", link: "https://muz.lc/Archive1", cover: "arc.jpg" }
        ].map((release, i) => (
          <a key={i} href={release.link} target="_blank" rel="noopener noreferrer" className="block">
            <div className={cx("p-4 rounded-3xl border hover:scale-105 transition-transform cursor-pointer", glow((i % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
              <div className="aspect-square rounded-2xl mb-3 overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}${release.cover}`} 
                  alt={release.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="font-semibold text-white hover:text-cyan-300 transition-colors">{release.title}</div>
              <div className="text-sm text-gray-400">Digital Hustlas</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function Discord() {
  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3 mb-4">
        <LivePill />
        <span className="text-gray-400">Discord Community</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold">Discord сервер</h1>
      
      <div className="mt-6 flex gap-4">
        <a href="http://discord.gg/digitalhustlas" target="_blank" rel="noopener noreferrer">
          <NeonButton variant="pink">Присоединиться к Discord</NeonButton>
        </a>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Discord виджет</h2>
        <div className={cx("rounded-3xl border p-6", glow(2))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <div className="aspect-video w-full rounded-2xl bg-black/40 grid place-items-center text-gray-500 border border-[#1F2937]">
            <div className="text-center">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm">Здесь будет встраивание Discord виджета</div>
              <div className="text-xs text-gray-600 mt-1">Показывает онлайн участников, активные каналы</div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              <span className="text-cyan-300 font-semibold">ONLINE</span> • 89 участников • 12 в голосовых каналах
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-xl bg-[#0F0F10] border border-[#1F2937] text-xs">#general</span>
              <span className="px-3 py-1 rounded-xl bg-[#0F0F10] border border-[#1F2937] text-xs">#31-flip</span>
              <span className="px-3 py-1 rounded-xl bg-[#0F0F10] border border-[#1F2937] text-xs">#collabs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {[
          { title: "Общие каналы", desc: "Комнаты для мероприятий" },
          { title: "Playground", desc: "Место для тренировок" },
          { title: "Games", desc: "Комната для тех кто играет в игры" },
          { title: "Radio", desc: "24/7 трансляция лучших треков из prod.by" }
        ].map((channel, i) => (
          <div key={i} className={cx("p-6 rounded-3xl border", glow((i % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
            <div className="text-xl font-bold mb-2">{channel.title}</div>
            <div className="text-gray-300 text-sm">{channel.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Media() {
  return (
    <div className="p-6 md:p-10">
      {/* Radio Section */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-4"><LivePill /><span className="text-gray-400">YouTube Live</span></div>
        <h1 className="text-3xl md:text-5xl font-extrabold">Digital Hustlas Radio</h1>
        <p className="mt-3 text-gray-300 max-w-2xl">Стримим отобранные модераторами треки и биты из закрытой группы prod.by.</p>

        <div className={cx("mt-8 rounded-3xl border p-6", glow(1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
          <div className="aspect-video w-full rounded-2xl bg-black/40 grid place-items-center text-gray-500">
            <span>Здесь будет встраивание YouTube‑плеера</span>
          </div>
        </div>

        <div className="mt-10 hidden">
          <h2 className="text-2xl font-bold mb-4">Архив эфиров</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {new Array(6).fill(0).map((_, i) => (
              <div key={i} className="p-4 rounded-3xl border" style={{ background: COLORS.card, borderColor: COLORS.border }}>
                <div className="aspect-video rounded-2xl bg-black/40 mb-3" />
                <div className="font-semibold">Выпуск #{i + 1}</div>
                <div className="text-sm text-gray-400">Подборка жанров: rap, electronic</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Releases Section */}
      <div className="mb-16">
        <h1 className="text-3xl md:text-5xl font-extrabold">Releases</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[
            { title: "PLAYBOOKIE PLAYMAKERAH vol.1", link: "https://band.link/playbookie", cover: "pp.jpg" },
            { title: "Late Night Phone Calls vol.1", link: "https://band.link/late_night_phone", cover: "lnpc.jpg" },
            { title: "Archive 1", link: "https://muz.lc/Archive1", cover: "arc.jpg" }
          ].map((release, i) => (
            <a key={i} href={release.link} target="_blank" rel="noopener noreferrer" className="block">
              <div className={cx("p-4 rounded-3xl border hover:scale-105 transition-transform cursor-pointer", glow((i % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
                <div className="aspect-square rounded-2xl mb-3 overflow-hidden">
                  <img 
                    src={`${import.meta.env.BASE_URL}${release.cover}`} 
                    alt={release.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="font-semibold text-white hover:text-cyan-300 transition-colors">{release.title}</div>
                <div className="text-sm text-gray-400">Digital Hustlas</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Playlists Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <LivePill />
          <span className="text-gray-400">Music Platforms</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold">Плейлисты</h1>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Площадки</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "SoundCloud",
                icon: "🎵",
                color: "#FF7700",
                playlists: [
                  { title: "Digital Hustlas Vol. 1", tracks: 24, duration: "1ч 23м", genre: "Rap/Electronic" },
                  { title: "31-FLIP Season 1", tracks: 18, duration: "58м", genre: "Battle Beats" },
                  { title: "prod.by Collabs", tracks: 31, duration: "2ч 15м", genre: "Mixed" }
                ]
              },
              {
                name: "Spotify",
                icon: "💚",
                color: "#1DB954",
                playlists: [
                  { title: "Digital Hustlas Official", tracks: 45, duration: "2ч 47м", genre: "Official Releases" },
                  { title: "31-FLIP Highlights", tracks: 22, duration: "1ч 12м", genre: "Tournament" },
                  { title: "Underground Beats", tracks: 38, duration: "2ч 33м", genre: "Experimental" }
                ]
              },
              {
                name: "Apple Music",
                icon: "🍎",
                color: "#FA243C",
                playlists: [
                  { title: "Digital Hustlas Collection", tracks: 52, duration: "3ч 18м", genre: "Complete" },
                  { title: "31-FLIP Winners", tracks: 15, duration: "45м", genre: "Champions" },
                  { title: "prod.by Showcase", tracks: 28, duration: "1ч 56м", genre: "Community" }
                ]
              },
              {
                name: "Яндекс.Музыка",
                icon: "🎧",
                color: "#FF0000",
                playlists: [
                  { title: "Digital Hustlas RU", tracks: 41, duration: "2ч 24м", genre: "Russian Edition" },
                  { title: "31-FLIP Сезон 2", tracks: 19, duration: "1ч 3м", genre: "New Season" },
                  { title: "prod.by Лучшее", tracks: 33, duration: "2ч 8м", genre: "Best Of" }
                ]
              }
            ].map((platform, idx) => (
              <div key={platform.name} className={cx("rounded-3xl border p-6", glow((idx % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">{platform.icon}</div>
                  <div>
                    <div className="text-xl font-bold">{platform.name}</div>
                    <div className="text-sm text-gray-400">{platform.playlists.length} плейлистов</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {platform.playlists.map((playlist, pIdx) => (
                    <div key={pIdx} className="p-3 rounded-2xl bg-[#0F0F10] border border-[#1F2937] hover:border-cyan-300 transition-colors cursor-pointer">
                      <div className="font-semibold text-sm mb-1">{playlist.title}</div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{playlist.tracks} треков</span>
                        <span>{playlist.duration}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{playlist.genre}</div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 px-4 py-2 rounded-xl bg-[#0F0F10] border border-[#1F2937] text-sm hover:border-cyan-300 transition-colors">
                  Открыть {platform.name}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Популярные плейлисты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "31-FLIP Season 1 Winners", platform: "Spotify", tracks: 15, followers: "2.4K", cover: "🏆" },
              { title: "Digital Hustlas Essentials", platform: "Apple Music", tracks: 52, followers: "1.8K", cover: "⭐" },
              { title: "prod.by Community Mix", platform: "SoundCloud", tracks: 31, followers: "3.1K", cover: "💎" }
            ].map((playlist, idx) => (
              <div key={idx} className={cx("rounded-3xl border p-6", glow((idx % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
                <div className="aspect-square rounded-2xl bg-black/40 mb-4 grid place-items-center text-4xl border border-[#1F2937]">
                  {playlist.cover}
                </div>
                <div className="font-bold text-lg mb-2">{playlist.title}</div>
                <div className="text-sm text-gray-400 mb-3">{playlist.platform}</div>
                <div className="flex items-center justify-between text-sm">
                  <span>{playlist.tracks} треков</span>
                  <span className="text-cyan-300">{playlist.followers} подписчиков</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Playlists() {
  const platforms = [
    {
      name: "SoundCloud",
      icon: "🎵",
      color: "#FF7700",
      playlists: [
        { title: "Digital Hustlas Vol. 1", tracks: 24, duration: "1ч 23м", genre: "Rap/Electronic" },
        { title: "31-FLIP Season 1", tracks: 18, duration: "58м", genre: "Battle Beats" },
        { title: "prod.by Collabs", tracks: 31, duration: "2ч 15м", genre: "Mixed" }
      ]
    },
    {
      name: "Spotify",
      icon: "💚",
      color: "#1DB954",
      playlists: [
        { title: "Digital Hustlas Official", tracks: 45, duration: "2ч 47м", genre: "Official Releases" },
        { title: "31-FLIP Highlights", tracks: 22, duration: "1ч 12м", genre: "Tournament" },
        { title: "Underground Beats", tracks: 38, duration: "2ч 33м", genre: "Experimental" }
      ]
    },
    {
      name: "Apple Music",
      icon: "🍎",
      color: "#FA243C",
      playlists: [
        { title: "Digital Hustlas Collection", tracks: 52, duration: "3ч 18м", genre: "Complete" },
        { title: "31-FLIP Winners", tracks: 15, duration: "45м", genre: "Champions" },
        { title: "prod.by Showcase", tracks: 28, duration: "1ч 56м", genre: "Community" }
      ]
    },
    {
      name: "Яндекс.Музыка",
      icon: "🎧",
      color: "#FF0000",
      playlists: [
        { title: "Digital Hustlas RU", tracks: 41, duration: "2ч 24м", genre: "Russian Edition" },
        { title: "31-FLIP Сезон 2", tracks: 19, duration: "1ч 3м", genre: "New Season" },
        { title: "prod.by Лучшее", tracks: 33, duration: "2ч 8м", genre: "Best Of" }
      ]
    }
  ];

  return (
    <div className="p-6 md:p-10">
      <div className="flex items-center gap-3 mb-4">
        <LivePill />
        <span className="text-gray-400">Music Platforms</span>
      </div>
      <h1 className="text-3xl md:text-5xl font-extrabold">Плейлисты</h1>
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Площадки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((platform, idx) => (
            <div key={platform.name} className={cx("rounded-3xl border p-6", glow((idx % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{platform.icon}</div>
                <div>
                  <div className="text-xl font-bold">{platform.name}</div>
                  <div className="text-sm text-gray-400">{platform.playlists.length} плейлистов</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {platform.playlists.map((playlist, pIdx) => (
                  <div key={pIdx} className="p-3 rounded-2xl bg-[#0F0F10] border border-[#1F2937] hover:border-cyan-300 transition-colors cursor-pointer">
                    <div className="font-semibold text-sm mb-1">{playlist.title}</div>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{playlist.tracks} треков</span>
                      <span>{playlist.duration}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{playlist.genre}</div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 px-4 py-2 rounded-xl bg-[#0F0F10] border border-[#1F2937] text-sm hover:border-cyan-300 transition-colors">
                Открыть {platform.name}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Популярные плейлисты</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "31-FLIP Season 1 Winners", platform: "Spotify", tracks: 15, followers: "2.4K", cover: "🏆" },
            { title: "Digital Hustlas Essentials", platform: "Apple Music", tracks: 52, followers: "1.8K", cover: "⭐" },
            { title: "prod.by Community Mix", platform: "SoundCloud", tracks: 31, followers: "3.1K", cover: "💎" }
          ].map((playlist, idx) => (
            <div key={idx} className={cx("rounded-3xl border p-6", glow((idx % 3) + 1))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
              <div className="aspect-square rounded-2xl bg-black/40 mb-4 grid place-items-center text-4xl border border-[#1F2937]">
                {playlist.cover}
              </div>
              <div className="font-bold text-lg mb-2">{playlist.title}</div>
              <div className="text-sm text-gray-400 mb-3">{playlist.platform}</div>
              <div className="flex items-center justify-between text-sm">
                <span>{playlist.tracks} треков</span>
                <span className="text-cyan-300">{playlist.followers} подписчиков</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={cx("relative w-full md:w-[500px] max-h-[90vh] overflow-auto p-6 md:p-8 rounded-t-3xl md:rounded-3xl border", glow(2))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold">Мой профиль</h1>
          <NeonButton onClick={onClose}>Закрыть</NeonButton>
        </div>
        
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-2xl text-gray-300">Скоро.</div>
        </div>
      </div>
    </div>
  );
}

function Navbar({ page, onNavigate, onOpenProfile }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const items = [
    { k: "home", t: "Home" },
    { k: "flip", t: "31‑FLIP" },
    { k: "media", t: "Media" },
    { k: "prod", t: "prod.by" },
    { k: "discord", t: "Discord" },
  ];

  const handleNavClick = (itemKey) => {
    onNavigate(itemKey);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 border-b border-[#111827]">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 flex items-center gap-4">
        <div className="flex items-center">
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="Logo" 
            className="h-10 w-auto object-contain cursor-pointer" 
            onClick={() => handleNavClick("home")}
          />
        </div>
        
        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex items-center gap-2">
          {items.map((it, i) => (
            <button
              key={it.k}
              onClick={() => onNavigate(it.k)}
              className={cx(
                "px-4 py-2 rounded-2xl text-sm font-semibold transition",
                page === it.k ? `text-white border border-[${COLORS.neon2}] ${glow(1)}` : "text-gray-400 hover:text-white"
              )}
            >
              {it.t}
            </button>
          ))}
        </nav>

        {/* User Profile Button */}
        <button
          onClick={onOpenProfile}
          className="p-2 rounded-xl border border-[#1F2937] hover:border-cyan-300 transition-colors"
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden ml-2 p-2 rounded-xl border border-[#1F2937] hover:border-cyan-300 transition-colors"
        >
          <div className="w-6 h-6 flex flex-col justify-center gap-1">
            <div className={`h-0.5 bg-white transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`h-0.5 bg-white transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`h-0.5 bg-white transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1F2937] bg-black/80 backdrop-blur">
          <nav className="px-4 py-4 space-y-2">
            {items.map((it, i) => (
              <button
                key={it.k}
                onClick={() => handleNavClick(it.k)}
                className={cx(
                  "w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold transition",
                  page === it.k ? `text-white border border-[${COLORS.neon2}] ${glow(1)}` : "text-gray-400 hover:text-white hover:bg-[#111111]"
                )}
              >
                {it.t}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [producers, setProducers] = useState(realProducers);
  const [openProducer, setOpenProducer] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const top3 = useMemo(() => {
    return [...producers]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 3);
  }, [producers]);

  const pageEl = useMemo(() => {
    switch (page) {
      case "flip":
        return <FlipLeaderboard data={producers} onOpenProducer={(p) => setOpenProducer(p)} />;
      case "media":
        return <Media />;
      case "prod":
        return <ProdBy />;
      case "discord":
        return <Discord />;
      default:
        return <Home onNavigate={setPage} top3={top3} />;
    }
  }, [page, producers, top3]);

  const handleOpenEvent = (eventId) => {
    setSelectedEventId(eventId);
    setEventModalOpen(true);
  };

  return (
    <div className="min-h-screen text-white" style={{ background: COLORS.bg }}>
      <style>{`
        /* Extra subtle neon gradient backdrop */
        body { background: ${COLORS.bg}; }
      `}</style>
      <Navbar page={page} onNavigate={setPage} onOpenProfile={() => setProfileOpen(true)} />
      <main className="max-w-6xl mx-auto">{pageEl}</main>
      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-500">
        Digital Hustlas — 31‑FLIP • prod.by • Radio • Releases
      </footer>
      <ProducerModal 
        producer={openProducer} 
        isOpen={!!openProducer} 
        onClose={() => setOpenProducer(null)} 
        onOpenEvent={handleOpenEvent}
      />
      <EventModal 
        eventId={selectedEventId} 
        isOpen={eventModalOpen} 
        onClose={() => setEventModalOpen(false)} 
      />
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
