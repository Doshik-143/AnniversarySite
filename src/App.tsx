
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Heart,
  LockKeyhole,
  Terminal,
} from "lucide-react";
import "./App.css";

function App() {
  const [started, setStarted] = useState(false);
  const [entered, setEntered] = useState(false);

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
                {started ? "CONNECTION ESTABLISHED" : "A SECRET MESSAGE FOR YOU"}
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
                  {started ? "ВІДКРИТИ ІСТОРІЮ" : "ІНІЦІАЛІЗУВАТИ LOVE.exe"}
                </span>
                <ArrowRight size={18} />
              </button>

              <p className="button-hint">
                {started
                  ? "ACCESS GRANTED // READY TO BEGIN"
                  : "NO RANDOM ACCESS. THIS ONE IS JUST FOR YOU."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              className="welcome-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <Heart className="big-heart" size={48} />
              <p className="eyebrow">ACCESS GRANTED</p>
              <h2>Привіт, коханий.</h2>
              <p className="hero-description">
                Шість років нашої історії — і це ще далеко не фінал.
              </p>
              <div className="coming-soon">
                <span className="status-dot" />
                НАСТУПНИЙ РІВЕНЬ ГОТУЄТЬСЯ...
              </div>
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