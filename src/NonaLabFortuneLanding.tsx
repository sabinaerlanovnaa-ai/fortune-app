// import React, { useMemo, useState, useEffect } from "react";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


/**
 * Nona lab — Fortune Cookie Landing (RU/EN)
 * - Casino-styled landing with burst effects
 * - Language gate (RU/EN)
 * - Clickable illustrated cookie (PNG with safe fallback)
 * - Randomized predictions (RU/EN)
 * - Company intro appears AFTER clicking "Исполнить/Fulfill" (above form fields)
 * - Fully responsive (mobile-first with Tailwind)
 */

// ---- STYLE HELPERS ----
const strokeText = (className = "") =>
  `relative ${className} font-black uppercase [text-shadow:2px_2px_0_#000,-2px_2px_0_#000,2px_-2px_0_#000,-2px_-2px_0_#000]`;

// ---- ICONS ----
const LinkedInIcon = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.983 3.5C4.983 4.88 3.881 6 2.5 6S0 4.88 0 3.5 1.102 1 2.5 1s2.483 1.12 2.483 2.5zM.3 8.25h4.4V23H.3V8.25zM8.6 8.25h4.214v2.012h.06c.587-1.112 2.02-2.285 4.158-2.285 4.448 0 5.268 2.92 5.268 6.714V23h-4.4v-6.58c0-1.57-.028-3.586-2.187-3.586-2.192 0-2.528 1.714-2.528 3.48V23H8.6V8.25z" />
  </svg>
);

// ---- COOKIE ASSET ----
// Try PNG from /public, fallback to inline SVG if missing (sandbox-safe)
const COOKIE_SRC = "/cookie.png"; // place your PNG at public/cookie.png

const FortuneCookie = ({ cracked = false }: { cracked?: boolean }) => {
  const [err, setErr] = useState(false);
  if (!err) {
    return (
      <img
        src={COOKIE_SRC}
        alt="Fortune cookie"
        width={192}
        height={192}
        className={`w-40 h-40 md:w-48 md:h-48 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] ${cracked ? "opacity-80" : ""}`}
        onError={() => setErr(true)}
      />
    );
  }
  // Fallback cartoon cookie (always available)
  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className="w-40 h-40 md:w-48 md:h-48 drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)]"
      aria-label="Fortune cookie"
    >
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffe3b0" />
          <stop offset="60%" stopColor="#e6a44b" />
          <stop offset="100%" stopColor="#b8731e" />
        </linearGradient>
      </defs>
      <path d="M256 64c-80 0-160 64-160 160s80 224 160 224 160-128 160-224S336 64 256 64z" fill="url(#cg)" stroke="#8b5a2b" strokeWidth="8" />
      <path d="M200 160c32-24 80-24 112 0" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
      {cracked && <path d="M250 180l12 24-20 18 28 18-14 24" stroke="#5a3214" strokeWidth="12" fill="none" />}
    </svg>
  );
};

// ---- COPY (RU/EN) ----
const COPY = {
  ru: {
    brand: "Nona lab",
    headline: "Жми сюда и узнай своё предсказание!",
    tap: "Жми на печеньку",
    openAnother: "Открыть ещё одну печеньку",
    fulfill: "Исполнить",
    langPrompt: "Выберите язык",
    formTitle: "Оставьте контакты — исполним предсказание!",
    name: "Имя",
    emailOrTg: "E-mail или Telegram",
    company: "Компания / проект (необязательно)",
    interests: "Что вас интересует?",
    interestOptions: ["Креативы", "Продакшн", "Трафик", "Партнёрство"],
    submit: "Отправить",
    thanksTitle: "Готово!",
    thanksBody: "Спасибо! Мы свяжемся с вами в ближайшее время.",
    aboutTitle: "Кто мы?",
    aboutBody:
      "Мы — Nona lab, креативное агентство. Делаем видео, баннеры и лендинги для гемблы и перформанс-трафика, которые помогают тестировать гипотезы, повышают ROI и ускоряют поиск рабочих связок.",
  },
  en: {
    brand: "Nona lab",
    headline: "Click here to get your prediction!",
    tap: "Tap the cookie",
    openAnother: "Open another cookie",
    fulfill: "Fulfill",
    langPrompt: "Choose your language",
    formTitle: "Leave your contacts — we'll make it happen!",
    name: "Name",
    emailOrTg: "E-mail or Telegram",
    company: "Company / project (optional)",
    interests: "What are you interested in?",
    interestOptions: ["Creatives", "Production", "Traffic", "Partnership"],
    submit: "Send",
    thanksTitle: "Done!",
    thanksBody: "Thank you! We'll contact you soon.",
    aboutTitle: "Who are we?",
    aboutBody:
      "We are Nona lab, a creative agency. We produce videos, banners and landings for gambling/performance traffic that help test hypotheses, boost ROI and accelerate finding winning combinations.",
  },
} as const;

// ---- PREDICTIONS ----
const PREDICTIONS_RU = [
  "Сегодня твой ROI будет чувствовать себя, как на допинге.",
  "Конверсия в депозит превзойдёт прогнозы медиабаинга.",
  "Сегодня твоя воронка покажет конверт, о котором напишут кейс-стади.",
  "Ретеншн будет липнуть к проекту, как игрок к рулетке.",
  "Сегодня твоя связка станет топ-1 в спенде.",
  "FTD вырастут так, что менеджер спросит: 'Это точно не бот-сет?'",
  "Трафик будет вести себя так чисто, будто он премиум от природы.",
  "LTV игроков превысит все таблички прогнозов.",
  "Твой CR будет настолько высокий, что его перепроверят дважды.",
  "Сегодня твой креатив станет 'чёрным лебедем' — и разнесёт рынок.",
  "Дополнительные депозиты будут приходить мягко и стабильно, без лишнего давления.",
  "Анреги обнулятся, а лиды будут конвертить в депозит.",
  "Твоя рекламная кампания попадёт в sweet spot — и удержит там надолго.",
  "Сегодня твой CR будет расти быстрее, чем твоя очередь в бар на конфе.",
  "Байерский чат будет думать, что ты подкрутил кабинет.",
  "Ставки игроков будут расти быстрее, чем твой спенд.",
  "У тебя появится связка, которую захочешь скрыть даже от партнёрки.",
  "ARPU превысит ожидания аналитиков.",
  "Игроки будут возвращаться снова и снова, как будто это магия.",
  "После твоей кампании Google и Meta попросят совета у тебя.",
];

const PREDICTIONS_EN = [
  "Your ROI will feel supercharged today.",
  "Deposit conversion will beat your media buying forecast.",
  "Your funnel will show a conversion worth a case study.",
  "Retention will stick to your product like a lucky streak.",
  "Your combo will hit Top-1 in spend today.",
  "FTDs will spike so hard your manager will ask if it's a bot set.",
  "Traffic quality will look premium by default.",
  "Player LTV will exceed every spreadsheet prediction.",
  "Your CR will be so high it'll be double-checked.",
  "Today's creative will be a black swan and rock the market.",
  "Upsells will land softly and steadily, no hard pressure.",
  "Unregs will vanish while leads convert to deposits.",
  "Your campaign will hit the sweet spot and stay there.",
  "Your CR will grow faster than the bar line at the conf.",
  "Buyer chat will think you tweaked the ad account.",
  "Player stakes will grow faster than your spend.",
  "You'll find a combo you'll want to hide even from the partner team.",
  "ARPU will beat the analysts' expectations.",
  "Players will keep coming back like it's magic.",
  "After your campaign, Google and Meta will ask you for tips.",
];

// ---- UTILS ----
function pickRandom<T>(arr: T[], rnd: () => number = Math.random): T {
  if (!arr || arr.length === 0) throw new Error("pickRandom: empty array");
  const idx = Math.floor(rnd() * arr.length);
  return arr[idx];
}

// ---- DEV TESTS (no-op in production) ----
const LINKEDIN_URL = "https://www.linkedin.com/company/nona-lab/";
// if (process.env.NODE_ENV !== "production") {
//   console.assert(PREDICTIONS_RU.length === 20, "RU predictions should be 20");
//   console.assert(PREDICTIONS_EN.length === 20, "EN predictions should be 20");
//   console.assert(typeof COOKIE_SRC === "string" && COOKIE_SRC.length > 0, "COOKIE_SRC must be a non-empty path");
//   (function testPickRandom() {
//     const sample = ["a", "b", "c"];
//     const first = pickRandom(sample, () => 0.0);
//     const end = pickRandom(sample, () => 0.9999);
//     console.assert(first === "a", "pickRandom should choose first with rnd=0");
//     console.assert(sample.includes(end), "pickRandom should choose valid element at rnd≈1");
//   })();
// }

if (import.meta.env.MODE !== "production") {
  console.assert(PREDICTIONS_RU.length === 20, "RU predictions should be 20");
  console.assert(PREDICTIONS_EN.length === 20, "EN predictions should be 20");
  console.assert(typeof COOKIE_SRC === "string" && COOKIE_SRC.length > 0, "COOKIE_SRC must be a non-empty path");
  (function testPickRandom() {
    const sample = ["a", "b", "c"];
    const first = pickRandom(sample, () => 0.0);
    const end = pickRandom(sample, () => 0.9999);
    console.assert(first === "a", "pickRandom should choose first with rnd=0");
    console.assert(sample.includes(end), "pickRandom should choose valid element at rnd≈1");
  })();
}


// ---- APP ----
export default function NonaLabFortuneLanding() {
  const [lang, setLang] = useState<null | "ru" | "en">(null);
  const [cracked, setCracked] = useState(false);
  const [fortune, setFortune] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [burst, setBurst] = useState(false);

  const dict = COPY[lang ?? "ru"];
  const predictions = useMemo(() => (lang === "en" ? PREDICTIONS_EN : PREDICTIONS_RU), [lang]);

  const handleCrack = () => {
    if (cracked) return;
    setCracked(true);
    setBurst(true);
    setTimeout(() => setBurst(false), 1000);
    setTimeout(() => setFortune(pickRandom(predictions)), 350);
  };

  useEffect(() => {
    // reset on language change
    setCracked(false);
    setFortune(null);
    setBurst(false);
  }, [lang]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black via-zinc-900 to-black text-white flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-5xl px-4 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Minimal square mark (no text to avoid tautology) */}
          <div className="w-9 h-9 rounded-md bg-lime-300 flex items-center justify-center font-black text-black">N</div>
        </div>
        {lang && (
          <button
            onClick={() => setLang(lang === "ru" ? "en" : "ru")}
            className="text-sm px-3 py-1 rounded-full border border-yellow-400 text-yellow-300 hover:bg-yellow-400/10"
          >
            {lang === "ru" ? "EN" : "RU"}
          </button>
        )}
      </header>

      {/* Hero */}
      <main className="flex-1 w-full max-w-4xl px-4 pb-24 pt-8 flex flex-col items-center">
        <h1 className={strokeText("text-center text-4xl md:text-5xl text-yellow-300 mb-6")}>{dict.headline}</h1>

        {/* Cookie CTA with burst/confetti */}
        <motion.button onClick={handleCrack} className="mt-6 relative" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <AnimatePresence>
            {burst && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 -z-10"
              >
                {/* glow ring */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-yellow-400/20 blur-2xl"
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1.25 }}
                  transition={{ duration: 0.6 }}
                />
                {/* confetti */}
                {Array.from({ length: 24 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      left: `${50 + Math.cos((i / 24) * Math.PI * 2) * 4}%`,
                      top: `${50 + Math.sin((i / 24) * Math.PI * 2) * 4}%`,
                      background: i % 3 === 0 ? "#fbbf24" : i % 3 === 1 ? "#ef4444" : "#10b981",
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos((i / 24) * Math.PI * 2) * 120,
                      y: Math.sin((i / 24) * Math.PI * 2) * 120,
                      opacity: 0,
                    }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <FortuneCookie cracked={cracked} />
          <div className="mt-2 text-center text-sm text-yellow-300/80">{dict.tap}</div>
        </motion.button>

        {/* Result card */}
        <AnimatePresence>
          {fortune && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-10 w-full max-w-2xl"
            >
              <div className="rounded-2xl border border-yellow-500/50 bg-gradient-to-b from-zinc-800 to-zinc-900 p-6 text-center shadow-[0_0_50px_rgba(255,200,0,0.2)]">
                <p className={strokeText("text-2xl md:text-3xl text-white mb-4 tracking-wide")}>{(fortune ?? "").toUpperCase()}</p>
                <button onClick={() => setLeadOpen(true)} className="px-7 py-3 rounded-full bg-gradient-to-b from-yellow-400 to-amber-500 text-black font-extrabold shadow-md">
                  {dict.fulfill}
                </button>
                <div className="mt-4">
                  <button className="text-sm text-yellow-300/80 hover:text-yellow-300" onClick={() => { setCracked(false); setFortune(null); }}>
                    {dict.openAnother}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Language gate */}
      <AnimatePresence>
        {!lang && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 text-center">
              <h2 className="text-2xl font-extrabold text-yellow-300 mb-4">{COPY.ru.langPrompt} / {COPY.en.langPrompt}</h2>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setLang("ru")} className="px-5 py-3 rounded-xl bg-yellow-400 text-black font-bold">RU</button>
                <button onClick={() => setLang("en")} className="px-5 py-3 rounded-xl bg-amber-500 text-black font-bold">EN</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lead form modal (contains Nona lab intro above fields) */}
      <AnimatePresence>
        {leadOpen && (
          <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="w-[92%] max-w-lg rounded-2xl bg-zinc-900 border border-yellow-500 p-6">
              <h3 className={strokeText("text-2xl text-yellow-300 mb-3")}>{dict.formTitle}</h3>
              <div className="rounded-xl bg-zinc-800/70 border border-zinc-700 p-3 mb-4 text-sm text-zinc-100">
                {dict.aboutBody}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setLeadOpen(false);
                }}
                className="grid gap-3"
              >
                <input name="name" placeholder={dict.name} className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700" required />
                <input name="contact" placeholder={dict.emailOrTg} className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700" required />
                <input name="company" placeholder={dict.company} className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700" />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setLeadOpen(false)} className="px-4 py-2 rounded-xl border border-zinc-700 text-zinc-200">Close</button>
                  <button type="submit" className="px-5 py-2 rounded-xl bg-gradient-to-b from-yellow-400 to-amber-500 text-black font-extrabold">{dict.submit}</button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer with LinkedIn link */}
      <footer className="w-full max-w-5xl px-4 pb-8 mt-auto text-center text-xs text-zinc-500 flex flex-col items-center gap-2">
        <span>© {new Date().getFullYear()} Nona lab — Fortune Cookie Demo</span>
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 text-zinc-400 hover:text-yellow-300 transition"
          aria-label="Nona lab on LinkedIn"
        >
          <LinkedInIcon className="w-5 h-5" />
          <span className="sr-only">LinkedIn</span>
        </a>
      </footer>
    </div>
  );
}
