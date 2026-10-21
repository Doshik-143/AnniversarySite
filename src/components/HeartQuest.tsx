import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

type HeartQuestProps = {
  collected: number[];
  onCollect: (id: number) => void;
  onRestart: () => void;
};

const targets = [
  { id: 1, x: 15, y: 23 },
  { id: 2, x: 72, y: 17 },
  { id: 3, x: 47, y: 52 },
  { id: 4, x: 22, y: 76 },
  { id: 5, x: 82, y: 72 },
];

const REQUIRED_HEARTS = 3;

export default function HeartQuest({
  collected,
  onCollect,
  onRestart,
}: HeartQuestProps) {
  return (
    <>
      <div className="quest-heading">
        <p className="eyebrow">QUEST_01 // ACTIVE MISSION</p>

        <h2>
          Find the heart<span className="accent">.</span>
        </h2>

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
              onClick={() => onCollect(target.id)}
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
        onClick={onRestart}
      >
        ПОЧАТИ ЗАНОВО
      </button>
    </>
  );
}
