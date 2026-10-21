import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";

type HeartQuestProps = {
  collected: number[];
  onCollect: (id: number) => void;
  onRestart: () => void;
};

type Target = {
  id: number;
  x: number;
  y: number;
};

const REQUIRED_HEARTS = 3;
const TOTAL_HEARTS = 5;
const MIN_DISTANCE = 0.24;
const HIT_RADIUS = 34;

function createTargets(): Target[] {
  const result: Target[] = [];
  let attempts = 0;

  while (result.length < TOTAL_HEARTS && attempts < 2000) {
    attempts++;

    const candidate: Target = {
      id: result.length + 1,
      x: 9 + Math.random() * 82,
      y: 14 + Math.random() * 72,
    };

    const hasEnoughSpace = result.every((target) => {
      const dx = (candidate.x - target.x) / 100;
      const dy = (candidate.y - target.y) / 100;

      return Math.hypot(dx, dy) >= MIN_DISTANCE;
    });

    if (hasEnoughSpace) {
      result.push(candidate);
    }
  }

  return result;
}

export default function HeartQuest({
  collected,
  onCollect,
  onRestart,
}: HeartQuestProps) {
  const [targets, setTargets] = useState<Target[]>(createTargets);
  const [missed, setMissed] = useState(false);

  function handleArenaClick(
    event: React.MouseEvent<HTMLDivElement>,
  ) {
    if (missed) setMissed(false);

    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const hiddenTarget = targets.find((target) => {
      if (collected.includes(target.id)) return false;

      const targetX = (target.x / 100) * rect.width;
      const targetY = (target.y / 100) * rect.height;

      return Math.hypot(clickX - targetX, clickY - targetY) <= HIT_RADIUS;
    });

    if (hiddenTarget) {
      onCollect(hiddenTarget.id);
      setMissed(false);
    } else {
      setMissed(true);
    }
  }

  function restartQuest() {
    setTargets(createTargets());
    setMissed(false);
    onRestart();
  }

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
        onClick={handleArenaClick}
        style={{ cursor: "crosshair" }}
      >
        <div className="arena-label">
          <span>LOCATION: UNKNOWN</span>
          <span>SEARCHING...</span>
        </div>

        {collected.map((id) => {
          const target = targets.find((item) => item.id === id);
          if (!target) return null;

          return (
            <motion.div
              key={id}
              className="found-heart"
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Heart size={20} fill="currentColor" />
            </motion.div>
          );
        })}

        <div className="arena-crosshair">+</div>

        {missed && (
          <motion.p
            className="arena-feedback"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Тут нічого немає... Спробуй ще 💗
          </motion.p>
        )}
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

      <button className="restart-button" onClick={restartQuest}>
        ПОЧАТИ ЗАНОВО
      </button>
    </>
  );
}