
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Heart,
  LockKeyhole,
  Terminal,
  Sparkles,
  Trophy,
} from "lucide-react";
import "./App.css";
import MemoryQuest from "./components/MemoryQuest";

const targets = [
  { id: 1, x: 15, y: 23 },
  { id: 2, x: 72, y: 17 },
  { id: 3, x: 47, y: 52 },
  { id: 4, x: 22, y: 76 },
  { id: 5, x: 82, y: 72 },
];

const REQUIRED_HEARTS = 3;

function App() {
  const [started, setStarted] = useState(false);
  const [entered, setEntered] = useState(false);
  const [questStarted, setQuestStarted] = useState(false);
  const [collected, setCollected] = useState<number[]>([]);

  const [memoryQuest, setMemoryQuest] = useState(false);

  const won = collected.length >= REQUIRED_HEARTS;

  function collectHeart(id: number) {
    setCollected((previous) =>
      previous.includes(id) ? previous : [...previous, id]
    );
  }

  function resetQuest() {
    setCollected([]);
  }

  return (
    <main className="screen">
      <div className="grid-overlay" />
      <div className="scanline" />

      <header className="topbar">
        <div className="brand">
          <Heart size={18} />
          <span>LOVE.exe</span>
        </div>

        <div className="system-status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>
      </header>

      <section className="hero">
        <motion.div
          className="terminal-tag"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Terminal size={15} />
          <span>PERSONAL PROJECT // 2026</span>
        </motion.div>

        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div
              key="intro"
              className="intro-content"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5 }}
            >
              <p className="eyebrow">
                {started
                  ? "CONNECTION ESTABLISHED"
                  : "A SECRET MESSAGE FOR YOU"}
              </p>

              <h1>
                LOVE<span className="accent">.</span>
                <br />
                <span className="outline-text">EXE</span>
              </h1>

              <p className="hero-description">
                {started
                  ? "Систему активовано. Ця історія створена спеціально для тебе."
                  : "Деякі історії неможливо описати одним повідомленням. Тому я створила дещо особливе."}
              </p>

              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="window-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span>love_system.exe</span>
                  <LockKeyhole size={13} />
                </div>

                <div className="terminal-body">
                  <p>
                    <span className="terminal-green">root@love:~$</span>{" "}
                    initializing_special_moment
                  </p>
                  <p className="muted">
                    [ OK ] Loading shared memories...
                  </p>
                  <p className="muted">
                    [ OK ] Checking heart connection...
                  </p>
                  <p className={started ? "terminal-green" : "terminal-pink"}>
                    {started
                      ? "[ OK ] Connection established."
                      : "[ WAIT ] Awaiting your permission..."}
                    {!started && <span className="cursor">_</span>}
                  </p>
                </div>
              </div>

              <button
                className="start-button"
                onClick={() => {
                  if (started) {
                    setEntered(true);
                  } else {
                    setStarted(true);
                  }
                }}
              >
                <span>
                  {started
                    ? "ВІДКРИТИ ІСТОРІЮ"
                    : "ІНІЦІАЛІЗУВАТИ LOVE.exe"}
                </span>
                <ArrowRight size={18} />
              </button>

              <p className="button-hint">
                {started
                  ? "ACCESS GRANTED // READY TO BEGIN"
                  : "NO RANDOM ACCESS. THIS ONE IS JUST FOR YOU."}
              </p>
            </motion.div>
          ) : !questStarted ? (
            <motion.div
              key="welcome"
              className="welcome-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Heart className="big-heart" size={48} />
              <p className="eyebrow">ACCESS GRANTED</p>
              <h2>Привіт, коханий.</h2>
              <p className="hero-description">
                Шість років нашої історії — і це ще далеко не фінал.
              </p>

              <div className="coming-soon">
                <span className="status-dot" />
                NEW QUEST DETECTED
              </div>

              <button
                className="start-button quest-launch"
                onClick={() => setQuestStarted(true)}
              >
                <span>ПОЧАТИ QUEST_01</span>
                <ArrowRight size={18} />
              </button>

              <p className="button-hint">
                OBJECTIVE: FIND THE HIDDEN HEARTS
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="quest"
              className="quest-screen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {!won ? (
                <>
                  <div className="quest-heading">
                    <p className="eyebrow">QUEST_01 // ACTIVE MISSION</p>
                    <h2>Find the heart<span className="accent">.</span></h2>
                    <p className="quest-description">
                      Знайди три приховані сердечка, щоб відкрити секрет.
                    </p>
                  </div>

                  <div className="quest-stats">
                    <span>
                      <Sparkles size={15} />
                      HEARTS FOUND
                    </span>
                    <strong>
                      {collected.length} / {REQUIRED_HEARTS}
                    </strong>
                  </div>

                  <div
                    className="quest-arena"
                    aria-label="Ігрове поле з прихованими сердечками"
                  >
                    <div className="arena-label">
                      <span>LOCATION: UNKNOWN</span>
                      <span>SEARCHING...</span>
                    </div>

                    {targets.map((target) => {
                      const found = collected.includes(target.id);

                      if (found) return null;

                      return (
                        <motion.button
                          key={target.id}
                          className="heart-target"
                          style={{
                            left: `${target.x}%`,
                            top: `${target.y}%`,
                          }}
                          onClick={() => collectHeart(target.id)}
                          aria-label={`Знайти сердечко ${target.id}`}
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.8 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: 1,
                            scale: [1, 1.12, 1],
                          }}
                          transition={{
                            opacity: { duration: 0.35 },
                            scale: {
                              duration: 2,
                              repeat: Infinity,
                              delay: target.id * 0.15,
                            },
                          }}
                        >
                          <Heart size={25} fill="currentColor" />
                        </motion.button>
                      );
                    })}

                    {collected.map((id) => {
                      const target = targets.find((item) => item.id === id);

                      if (!target) return null;

                      return (
                        <motion.div
                          key={`found-${id}`}
                          className="found-heart"
                          style={{
                            left: `${target.x}%`,
                            top: `${target.y}%`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <Heart size={20} fill="currentColor" />
                        </motion.div>
                      );
                    })}

                    <div className="arena-crosshair">+</div>
                  </div>

                  <div className="quest-progress">
                    <div className="progress-track">
                      <motion.div
                        className="progress-fill"
                        animate={{
                          width: `${(collected.length / REQUIRED_HEARTS) * 100}%`,
                        }}
                      />
                    </div>
                    <span>
                      {collected.length === 0
                        ? "СИСТЕМА ЧЕКАЄ НА ТЕБЕ..."
                        : "HEART CONNECTION DETECTED"}
                    </span>
                  </div>

                  <button
                    className="restart-button"
                    onClick={resetQuest}
                  >
                    ПОЧАТИ ЗАНОВО
                  </button>
                </>
              ) : memoryQuest ? (
                <MemoryQuest
                  onComplete={() => {
                    setMemoryQuest(false);
                    setQuestStarted(false);
                    setEntered(false);
                    setStarted(false);
                    setCollected([]);
                  }}
                />
              ) : (
                <motion.div
                  className="victory-screen"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="trophy-icon">
                    <Trophy size={34} />
                  </div>

                  <p className="eyebrow">QUEST COMPLETED</p>
                  <h2>Ти знайшов мене. ❤️</h2>
                  <p className="hero-description">
                    Усі сердечка зібрано. Але найцінніше, що ти можеш знайти
                    тут, — це наша історія.
                  </p>

                  <div className="secret-message">
                    <LockKeyhole size={19} />
                    <div>
                      <span>SECRET MESSAGE UNLOCKED</span>
                      <p>Попереду дещо особливе...</p>
                    </div>
                  </div>

                  <button
                    className="start-button"
                    onClick={() => setMemoryQuest(true)}
                  >
                    <span>ВІДКРИТИ АРХІВ СПОГАДІВ</span>
                    <ArrowRight size={18} />
                  </button>

                  <p className="button-hint">
                    QUEST_01 // COMPLETED WITH LOVE
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <footer className="footer">
        <span>ENCRYPTED WITH LOVE</span>
        <span>EST. 2020 — ∞</span>
      </footer>
    </main>
  );
}

export default App;