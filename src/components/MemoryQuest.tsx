
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

type MemoryQuestProps = {
  onComplete: () => void;
};

const answers = [
  { id: "a", text: "Наша перша зустріч" },
  { id: "b", text: "Наші спільні пригоди" },
  { id: "c", text: "Усе, що ми пережили разом" },
];

export default function MemoryQuest({
  onComplete,
}: MemoryQuestProps) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const correctAnswer = "c";

  function checkAnswer() {
    if (selected === correctAnswer) {
      setRevealed(true);
    }
  }

  return (
    <motion.div
      className="memory-quest"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="memory-header">
        <span className="memory-label">
          MEMORY_ARCHIVE // 2020—2026
        </span>
        <Heart size={18} className="memory-heart" />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="archive"
            className="memory-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="memory-icon">
              <LockKeyhole size={30} />
            </div>

            <p className="eyebrow">QUEST_02 // MEMORY ARCHIVE</p>
            <h2>Шість років.</h2>

            <p className="memory-description">
              Шість років маленьких моментів, великих почуттів,
              жартів, пригод і спогадів, які належать тільки нам.
            </p>

            <div className="memory-stats">
              <div>
                <span>TIME TOGETHER</span>
                <strong>6 YEARS</strong>
              </div>
              <div>
                <span>MEMORIES</span>
                <strong>INFINITE</strong>
              </div>
            </div>

            <button
              className="start-button"
              onClick={() => setStep(1)}
            >
              <span>ВІДКРИТИ СПОГАД</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>
        ) : !revealed ? (
          <motion.div
            key="question"
            className="memory-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="eyebrow">SECURITY QUESTION // 001</p>
            <h2>У чому наш секрет?</h2>

            <p className="memory-description">
              Що робить нашу історію особливою?
            </p>

            <div className="answer-list">
              {answers.map((answer) => (
                <button
                  key={answer.id}
                  className={`answer-option ${
                    selected === answer.id ? "selected" : ""
                  }`}
                  onClick={() => setSelected(answer.id)}
                  aria-pressed={selected === answer.id}
                >
                  <span className="answer-key">
                    {answer.id.toUpperCase()}
                  </span>
                  <span>{answer.text}</span>
                </button>
              ))}
            </div>

            <button
              className="start-button"
              disabled={!selected}
              onClick={checkAnswer}
            >
              <span>ПЕРЕВІРИТИ ВІДПОВІДЬ</span>
              <ArrowRight size={18} />
            </button>

            <p className="button-hint">
              HINT: THE ANSWER IS IN OUR HEARTS
            </p>

            <button
              className="restart-button"
              onClick={() => setStep(0)}
            >
              <ArrowLeft size={14} /> НАЗАД ДО АРХІВУ
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            className="memory-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="memory-icon unlocked">
              <Sparkles size={30} />
            </div>

            <p className="eyebrow">MEMORY UNLOCKED</p>
            <h2>Мій улюблений спогад. ❤️</h2>

            <div className="memory-photo-placeholder">
              <Heart size={34} />
              <span>OUR PHOTO GOES HERE</span>
            </div>

            <p className="memory-description">
              Шість років тому почалася наша історія.
              І я б знову обрала тебе — у кожній версії
              нашого життя.
            </p>

            <div className="secret-message">
              <Heart size={19} />
              <div>
                <span>PERSONAL MESSAGE</span>
                <p>Ти — моя найулюбленіша частина цієї історії.</p>
              </div>
            </div>

            <button className="start-button" onClick={onComplete}>
              <span>ДАЛІ — БІЛЬШЕ ❤️</span>
              <ArrowRight size={18} />
            </button>

            <p className="button-hint">
              END OF MEMORY // NOT THE END OF OUR STORY
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}