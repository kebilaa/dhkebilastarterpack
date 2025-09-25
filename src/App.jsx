import React, { useEffect, useMemo, useState } from "react";

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

// ---- REAL DATA ----
const realProducers = [
  { id: 1, name: "XN", userId: "689398266810728459", totalPoints: 32.6, weightedScore: 54.8, totalWorks: 47, rounds: { "1346482874857291838-Round 1": 33.5, "1346482874857291838-Round 2": 31.6, "1346482874857291838-Round 3": 34.6, "1346482874857291838-Round 4": 33.1, "1346482874857291838-Round 5": 29.8, "1347561694867488789-Round 1": 38.8, "1347561694867488789-Round 2": 30.8, "1347561694867488789-Round 3": 32.1, "1347561694867488789-Round 4": 34.8, "1349008508884090910-Round 1": 29.2, "1349008508884090910-Round 2": 36.2, "1349008508884090910-Round 3": 29.7, "1349008508884090910-Round 4": 34.4, "1352945465368510504-Round 1": 35.1, "1352945465368510504-Round 2": 35.8, "1352945465368510504-Round 3": 34.6, "1352945465368510504-Round 4": 38.7, "1355483362206154855-Round 1": 29.5, "1355483362206154855-Round 2": 32.2, "1355483362206154855-Round 3": 31.4, "1355483362206154855-Round 4": 34.5, "1355483362206154855-Round 5": 30.2, "1355483362206154855-Round 6": 31.6 } },
  { id: 3, name: "Муса Дореус", userId: "422829998433632257", totalPoints: 31.5, weightedScore: 49.4, totalWorks: 36, rounds: { "1347561694867488789-Round 1": 28.9, "1347561694867488789-Round 2": 37.0, "1347561694867488789-Round 3": 30.5, "1347561694867488789-Round 4": 28.9, "1349008508884090910-Round 1": 32.0, "1349008508884090910-Round 2": 26.6, "1349008508884090910-Round 3": 28.3, "1349008508884090910-Round 4": 40.1, "1352945465368510504-Round 1": 34.8, "1352945465368510504-Round 2": 38.9, "1352945465368510504-Round 3": 34.1, "1352945465368510504-Round 4": 34.7, "1352945465368510504-Round 5": 31.7, "1352945465368510504-Round 6": 28.5, "1352945465368510504-Round 7": 33.3, "1355483362206154855-Round 1": 32.9, "1355483362206154855-Round 2": 35.8, "1355483362206154855-Round 3": 35.0, "1355483362206154855-Round 4": 32.3, "1355483362206154855-Round 5": 33.3 } },
  { id: 4, name: "ONLYTHENEXT", userId: "729775540424278149", totalPoints: 32.7, weightedScore: 47.3, totalWorks: 27, rounds: { "1346482874857291838-Round 3": 36.8, "1347561694867488789-Round 1": 37.3, "1347561694867488789-Round 2": 38.7, "1347561694867488789-Round 3": 35.4, "1349008508884090910-Round 1": 29.0, "1349008508884090910-Round 2": 25.9, "1349008508884090910-Round 3": 32.3, "1349008508884090910-Round 4": 34.8, "1352945465368510504-Round 1": 38.5, "1352945465368510504-Round 2": 39.1, "1355483362206154855-Round 1": 31.3, "1355483362206154855-Round 2": 33.3, "1355483362206154855-Round 3": 28.8 } },
  { id: 5, name: "Леон", userId: "692692176244834335", totalPoints: 29.0, weightedScore: 46.1, totalWorks: 38, rounds: { "1346482874857291838-Round 1": 33.4, "1346482874857291838-Round 3": 27.9, "1346482874857291838-Round 4": 30.0, "1346482874857291838-Round 5": 30.0, "1347561694867488789-Round 1": 35.4, "1347561694867488789-Round 2": 31.0, "1347561694867488789-Round 3": 33.0, "1349008508884090910-Round 1": 22.0, "1349008508884090910-Round 2": 33.0, "1349008508884090910-Round 3": 22.5, "1349008508884090910-Round 4": 28.1, "1352945465368510504-Round 1": 29.7, "1352945465368510504-Round 2": 32.7, "1352945465368510504-Round 3": 26.7, "1355483362206154855-Round 1": 25.3, "1355483362206154855-Round 2": 30.8, "1355483362206154855-Round 4": 30.8, "1355483362206154855-Round 6": 22.8 } },
  { id: 6, name: "Tony Helfiger", userId: "777483643051835392", totalPoints: 29.3, weightedScore: 44.9, totalWorks: 33, rounds: { "1346482874857291838-Round 2": 23.0, "1346482874857291838-Round 4": 27.9, "1346482874857291838-Round 5": 36.2, "1346482874857291838-Round 6": 29.7, "1347561694867488789-Round 1": 24.7, "1347561694867488789-Round 2": 25.1, "1347561694867488789-Round 3": 26.8, "1347561694867488789-Round 4": 26.3, "1349008508884090910-Round 1": 31.7, "1349008508884090910-Round 2": 32.5, "1349008508884090910-Round 3": 23.2, "1349008508884090910-Round 4": 39.5, "1352945465368510504-Round 1": 28.3, "1352945465368510504-Round 2": 37.4, "1352945465368510504-Round 4": 35.3, "1355483362206154855-Round 2": 32.3, "1355483362206154855-Round 4": 23.4, "1355483362206154855-Round 6": 37.5 } },
  { id: 7, name: "Slleem", userId: "624013571759800320", totalPoints: 29.2, weightedScore: 44.4, totalWorks: 32, rounds: { "1346482874857291838-Round 1": 31.3, "1346482874857291838-Round 3": 29.8, "1346482874857291838-Round 5": 33.0, "1347561694867488789-Round 2": 35.2, "1347561694867488789-Round 3": 28.5, "1347561694867488789-Round 4": 31.0, "1349008508884090910-Round 1": 29.7, "1349008508884090910-Round 3": 24.7, "1349008508884090910-Round 4": 25.8, "1352945465368510504-Round 1": 27.1, "1352945465368510504-Round 2": 27.8, "1352945465368510504-Round 3": 29.7, "1352945465368510504-Round 4": 34.3, "1352945465368510504-Round 5": 32.7, "1355483362206154855-Round 1": 33.1, "1355483362206154855-Round 2": 29.3, "1355483362206154855-Round 3": 27.5, "1355483362206154855-Round 5": 29.0 } },
  { id: 8, name: "PLAYDADDY", userId: "279986249094397982", totalPoints: 31.3, weightedScore: 44.3, totalWorks: 25, rounds: { "1349008508884090910-Round 1": 35.3, "1349008508884090910-Round 2": 32.0, "1349008508884090910-Round 3": 34.4, "1349008508884090910-Round 4": 33.3, "1352945465368510504-Round 1": 34.0, "1352945465368510504-Round 2": 26.1, "1352945465368510504-Round 3": 33.5, "1352945465368510504-Round 4": 28.0, "1352945465368510504-Round 5": 30.7, "1352945465368510504-Round 6": 33.6 } },
  { id: 9, name: "friedeyez?", userId: "305386727403683851", totalPoints: 30.0, weightedScore: 43.8, totalWorks: 28, rounds: { "1347561694867488789-Round 1": 27.7, "1347561694867488789-Round 2": 26.1, "1349008508884090910-Round 1": 31.8, "1349008508884090910-Round 2": 28.3, "1352945465368510504-Round 1": 37.3, "1352945465368510504-Round 2": 35.0, "1352945465368510504-Round 3": 32.3, "1352945465368510504-Round 4": 35.7, "1352945465368510504-Round 5": 27.8, "1352945465368510504-Round 6": 31.2, "1352945465368510504-Round 7": 27.9 } },
  { id: 10, name: "Wistful Waves", userId: "298580088323309578", totalPoints: 29.8, weightedScore: 43.1, totalWorks: 27, rounds: { "1346482874857291838-Round 2": 31.4, "1346482874857291838-Round 3": 35.9, "1347561694867488789-Round 1": 36.8, "1347561694867488789-Round 2": 32.3, "1347561694867488789-Round 3": 35.4, "1347561694867488789-Round 4": 33.7, "1349008508884090910-Round 1": 27.2, "1349008508884090910-Round 2": 30.7, "1349008508884090910-Round 3": 30.7, "1349008508884090910-Round 4": 22.7, "1352945465368510504-Round 1": 35.4, "1352945465368510504-Round 3": 35.2, "1355483362206154855-Round 1": 22.0 } }
];

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
      <section className="min-h-[40vh] flex flex-col items-start justify-center gap-6">
        <h1 className="text-4xl md:text-7xl font-extrabold leading-tight">
          DIGITAL HUSTLAS
        </h1>
        <div className="flex flex-wrap gap-4">
          <NeonButton onClick={() => onNavigate("flip")}>Смотреть рейтинг 31‑FLIP</NeonButton>
          <NeonButton variant="pink" onClick={() => onNavigate("prod")}>Вступить в prod.by</NeonButton>
          <NeonButton variant="alt" onClick={() => onNavigate("radio")}>Слушать Radio</NeonButton>
          <NeonButton variant="alt" onClick={() => onNavigate("discord")}>Присоединиться к Discord</NeonButton>
        </div>
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
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Топ‑3 прямо сейчас</h2>
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

      <section className="mt-16 grid grid-cols-1 md:grid-cols-5 gap-6">
        {[
          { k: "flip", t: "31‑FLIP", d: "Турнир: раунды, таблица, профили" },
          { k: "radio", t: "Radio", d: "Live YouTube поток и архив" },
          { k: "prod", t: "prod.by", d: "Закрытое комьюнити по подписке" },
          { k: "releases", t: "Releases", d: "Сборники и каталоги" },
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

function ProducerModal({ producer, onClose }) {
  if (!producer) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={cx("relative w-full md:w-[860px] max-h-[90vh] overflow-auto p-6 md:p-8 rounded-t-3xl md:rounded-3xl border", glow(2))} style={{ background: COLORS.card, borderColor: COLORS.border }}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#1F2937] flex items-center justify-center text-lg font-bold text-white">
            {producer.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold">{producer.name}</div>
            <div className="text-sm text-gray-400">ID: {producer.userId} • Баллы: {producer.totalPoints} • Работ: {producer.totalWorks}</div>
          </div>
          <NeonButton onClick={onClose}>Закрыть</NeonButton>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="text-lg font-semibold mb-2">Результаты по раундам</div>
            <div className="flex gap-3 flex-wrap">
              {Object.entries(producer.rounds).map(([round, score]) => (
                <div key={round} className="px-4 py-3 rounded-2xl bg-[#0F0F10] border border-[#1F2937]">
                  <div className="text-xs text-gray-400">{round.split('-')[0].slice(-4)} R{round.split('Round ')[1]}</div>
                  <div className="text-xl font-bold">{score} баллов</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="text-lg font-semibold mb-2">Статистика</div>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center justify-between">
                  <span>Итого баллов:</span>
                  <span className="font-bold">{producer.totalPoints}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Взвешенный балл:</span>
                  <span className="font-bold">{producer.weightedScore}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Всего работ:</span>
                  <span className="font-bold">{producer.totalWorks}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-lg font-semibold mb-2">Информация</div>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Пользователь: <span className="font-bold">{producer.name}</span></div>
              <div>ID: <span className="font-mono text-xs">{producer.userId}</span></div>
            </div>
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

function Profile() {
  return (
    <div className="p-6 md:p-10">
      <h1 className="text-3xl md:text-5xl font-extrabold">Мой профиль</h1>
      <div className="mt-6 flex items-center justify-center min-h-[40vh]">
        <div className="text-2xl text-gray-300">Скоро.</div>
      </div>
    </div>
  );
}

function Navbar({ page, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const items = [
    { k: "home", t: "Home" },
    { k: "flip", t: "31‑FLIP" },
    { k: "radio", t: "Radio" },
    { k: "prod", t: "prod.by" },
    { k: "releases", t: "Releases" },
    { k: "discord", t: "Discord" },
    { k: "playlists", t: "Плейлисты" },
    { k: "profile", t: "Профиль" },
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

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden ml-auto p-2 rounded-xl border border-[#1F2937] hover:border-cyan-300 transition-colors"
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

  const top3 = useMemo(() => {
    return [...producers]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 3);
  }, [producers]);

  const pageEl = useMemo(() => {
    switch (page) {
      case "flip":
        return <FlipLeaderboard data={producers} onOpenProducer={(p) => setOpenProducer(p)} />;
      case "radio":
        return <Radio />;
      case "prod":
        return <ProdBy />;
      case "releases":
        return <Releases />;
      case "discord":
        return <Discord />;
      case "playlists":
        return <Playlists />;
      case "profile":
        return <Profile />;
      default:
        return <Home onNavigate={setPage} top3={top3} />;
    }
  }, [page, producers, top3]);

  return (
    <div className="min-h-screen text-white" style={{ background: COLORS.bg }}>
      <style>{`
        /* Extra subtle neon gradient backdrop */
        body { background: ${COLORS.bg}; }
      `}</style>
      <Navbar page={page} onNavigate={setPage} />
      <main className="max-w-6xl mx-auto">{pageEl}</main>
      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm text-gray-500">
        Digital Hustlas — 31‑FLIP • prod.by • Radio • Releases
      </footer>
      <ProducerModal producer={openProducer} onClose={() => setOpenProducer(null)} />
    </div>
  );
}
