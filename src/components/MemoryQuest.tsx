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

type Answer = { id: string; text: string };
type Question = {
  prompt: string;
  description: string;
  answers: Answer[];
  correctAnswer: string;
  hint: string;
};
type Quest = {
  code: string;
  title: string;
  questions: Question[];
  rewardTitle: string;
  subtitle?: string;
  rewardText: string;
  rewardMessage: string;
  rewardLabel: string;
  photoLabel: string;
};

const quests: Quest[] = [
  {
    code: "QUEST_01",
    title: "THE FIRST GLANCE",
    questions: [
      {
        prompt: "Коли насправді почалася наша історія?",
        description: "Що було між нами ще до того, як ми почали спілкуватися?",
        answers: [
          { id: "a", text: "Коли ми вперше заговорили" },
          { id: "b", text: "Коли ми почали переписуватися" },
          { id: "c", text: "Коли ми мовчки дивилися одне одному в очі" },
        ],
        correctAnswer: "c",
        hint: "HINT: SOMETIMES SILENCE SAYS EVERYTHING",
      },
    ],
    rewardTitle: "Наш маленький космос. ✨",
    rewardText:
      "Ми ще навіть не говорили одне з одним, але вже могли довго дивитися в очі. Ніби там був цілий космос, який хотілося розгадати. Можливо, наша історія почалася набагато раніше за перше повідомлення.",
    rewardMessage: "CONNECTION DETECTED BEFORE FIRST CONTACT",
    rewardLabel: "ПЕРШИЙ ПОГЛЯД",
    photoLabel: "ТУТ БУДЕ НАШЕ ФОТО",
  },
  {
    code: "QUEST_02",
    title: "THE FIRST MESSAGE",
    questions: [
      {
        prompt: "Яке повідомлення стало початком нашого спілкування?",
        description: "Одне коротке повідомлення. Трохи дивне. Абсолютно незабутнє.",
        answers: [
          { id: "a", text: "«Привіт, як справи?»" },
          { id: "b", text: "«Не лайкай пж, бо я сплю»" },
          { id: "c", text: "«Скинь, що задали на завтра»" },
        ],
        correctAnswer: "b",
        hint: "HINT: PLEASE DON'T LIKE, I'M SLEEPING 😭",
      },
    ],
    rewardTitle: "Початок легенди. 😂",
    rewardText:
      "Почати історію кохання з прохання не лайкати, бо людина спить, — це дуже в нашому стилі. А потім була історія з домашнім завданням і його найкращим другом… і ми почали спілкуватися дедалі більше.",
    rewardMessage: "BONUS MEME UNLOCKED: «ЧУПАПІМУНЯНЮ»",
    rewardLabel: "АРХІВ ПЕРШИХ ПОВІДОМЛЕНЬ",
    photoLabel: "ТУТ МОЖЕ БУТИ СКРИНШОТ ЧАТУ",
  },
  {
    code: "QUEST_03",
    title: "THE TRUTH",
    questions: [
      {
        prompt: "У яку гру ми грали, щоб дізнаватися одне одного краще?",
        description: "Ми ставили запитання по черзі. І так — день за днем.",
        answers: [
          { id: "a", text: "«Правда чи дія»" },
          { id: "b", text: "«Правда»" },
          { id: "c", text: "«Вгадай мою думку»" },
        ],
        correctAnswer: "b",
        hint: "HINT: ONLY HONEST ANSWERS",
      },
      {
        prompt: "Яке запитання змінило нашу історію?",
        description: "Той момент, коли гра раптом стала чимось набагато більшим.",
        answers: [
          { id: "a", text: "«Коли ми побачимося?»" },
          { id: "b", text: "«Ти хочеш зі мною зустрічатися?»" },
          { id: "c", text: "«Чи подобаюсь я тобі?»" },
        ],
        correctAnswer: "c",
        hint: "HINT: THE QUESTION THAT CHANGED EVERYTHING",
      },
    ],
    rewardTitle: "Ну так… а я тобі? ❤️",
    rewardText:
      "Ти запитав: «Чи подобаюсь я тобі?». Я засоромилася й відповіла: «Ну так, а я тобі?». А ти теж сказав, що так. І в ту мить ми зрозуміли, що почуття взаємні. Так почалася наша історія — і я щаслива, що вона триває вже шість років.",
    rewardMessage: "TWO HEARTS. ONE ANSWER. OUR STORY.",
    rewardLabel: "НАЙВАЖЛИВІШИЙ СПОГАД",
    photoLabel: "ТУТ БУДЕ НАШЕ УЛЮБЛЕНЕ ФОТО",
  },
];

export default function MemoryQuest({ onComplete }: MemoryQuestProps) {
  const [phase, setPhase] = useState<"intro" | "question" | "memory" | "letter">("intro");
  const [questIndex, setQuestIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  const quest = quests[questIndex];
  const question = quest.questions[questionIndex];

  function checkAnswer() {
    if (!selected) return;
    if (selected !== question.correctAnswer) {
      setFeedback("НЕ ЗОВСІМ 💗 Спробуй ще раз — ти ж знаєш нашу історію.");
      return;
    }

    setFeedback("");
    if (questionIndex < quest.questions.length - 1) {
      setQuestionIndex((previous) => previous + 1);
      setSelected(null);
      return;
    }
    setPhase("memory");
  }

  function continueFromMemory() {
    if (questIndex < quests.length - 1) {
      setQuestIndex((previous) => previous + 1);
      setQuestionIndex(0);
      setSelected(null);
      setFeedback("");
      setPhase("question");
      return;
    }
    setPhase("letter");
  }

  return (
    <motion.div
      className="memory-quest"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="memory-header">
        <span className="memory-label">MEMORY_ARCHIVE // 2020—2026</span>
        <Heart size={18} className="memory-heart" />
      </div>

      <AnimatePresence mode="wait">
        {phase === "intro" ? (
          <motion.div key="archive" className="memory-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="memory-icon"><LockKeyhole size={30} /></div>
            <p className="eyebrow">SECRET ARCHIVE // ACCESS GRANTED</p>
            <h2>Шість років.</h2>
            <p className="memory-description">Три квести. Три частини нашої історії. Спогади, жарти й слова, які зрозуміємо тільки ми.</p>
            <div className="memory-stats">
              <div><span>TIME TOGETHER</span><strong>6 YEARS</strong></div>
              <div><span>MEMORIES</span><strong>INFINITE</strong></div>
            </div>
            <button className="start-button" onClick={() => setPhase("question")}><span>ВІДКРИТИ ПЕРШИЙ КВЕСТ</span><ArrowRight size={18} /></button>
          </motion.div>
        ) : phase === "question" ? (
          <motion.div key={`${quest.code}-${questionIndex}`} className="memory-panel" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="eyebrow">{quest.code} // QUESTION {questionIndex + 1}{quest.questions.length > 1 ? ` OF ${quest.questions.length}` : ""}</p>
            <h2>{quest.title}</h2>
            <p className="memory-description">{question.prompt}</p>
            <p className="memory-description">{question.description}</p>
            <div className="answer-list">
              {question.answers.map((answer) => (
                <button key={answer.id} className={`answer-option ${selected === answer.id ? "selected" : ""}`} onClick={() => { setSelected(answer.id); setFeedback(""); }} aria-pressed={selected === answer.id}>
                  <span className="answer-key">{answer.id.toUpperCase()}</span><span>{answer.text}</span>
                </button>
              ))}
            </div>
            <button className="start-button" disabled={!selected} onClick={checkAnswer}><span>ПЕРЕВІРИТИ ВІДПОВІДЬ</span><ArrowRight size={18} /></button>
            {feedback && <p className="button-hint">{feedback}</p>}
            <p className="button-hint">{question.hint}</p>
            <p className="button-hint">PROGRESS: {questIndex + 1} / {quests.length}</p>
          </motion.div>
        ) : phase === "memory" ? (
          <motion.div key={`memory-${quest.code}`} className="memory-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="memory-icon unlocked"><Sparkles size={30} /></div>
            <p className="eyebrow">MEMORY UNLOCKED // {quest.code}</p>
            <h2>{quest.rewardTitle}</h2>
            <div className="memory-photo-placeholder">
              <img
                className="memory-photo"
                src={
                  questIndex === 0
                    ? "/images/memories/first-glance.jpg"
                    : questIndex === 1
                      ? "/images/memories/funny-memory.jpg"
                      : "/images/memories/our-beginning.jpg"
                }
                alt={quest.subtitle}
              />
            </div>
            <p className="memory-description">{quest.rewardText}</p>
            <div className="secret-message"><Heart size={19} /><div><span>{quest.rewardLabel}</span><p>{quest.rewardMessage}</p></div></div>
            <button className="start-button" onClick={continueFromMemory}><span>{questIndex < quests.length - 1 ? "ВІДКРИТИ НАСТУПНИЙ СПОГАД" : "ПЕРЕЙТИ ДО ЛИСТА ❤️"}</span><ArrowRight size={18} /></button>
            <p className="button-hint">MEMORY {questIndex + 1} / {quests.length} // SAVED WITH LOVE</p>
          </motion.div>
        ) : (
          <motion.div key="letter" className="memory-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}>
            <div className="memory-icon unlocked"><Heart size={30} /></div>
            <p className="eyebrow">FINAL FILE // OPENED WITH LOVE</p>
            <h2>Моєму коханому. ❤️</h2>
            <div className="memory-photo-placeholder final-photo">
              <img
                className="memory-photo"
                src="/images/memories/favorite-photo.jpg"
                alt="Мій найулюбленіший спогад із тобою"
              />
            </div>
            <p className="memory-description">Шість років тому я ще не знала, скільки всього нас чекає. Не знала, скільки буде сміху, наших дивних жартів, важливих розмов і моментів, які захочеться зберегти назавжди.</p>
            <p className="memory-description">Але якби мені дали можливість повернутися в той самий початок — до тих поглядів, до першого дивного повідомлення, до нашої «Правди», — я б знову пройшла цей шлях. Бо він привів мене до тебе.</p>
            <p className="memory-description">Дякую за нашу історію. За те, що ми є одне в одного. І за всі сторінки, які нам іще належить написати. Я люблю тебе. З нашою річницею, коханий. 💗</p>
            <div className="secret-message"><Sparkles size={19} /><div><span>LOVE.exe // STATUS</span><p>Шість років позаду. Ціла вічність попереду.</p></div></div>
            <button className="start-button" onClick={onComplete}><span>ПОВЕРНУТИСЯ НА ПОЧАТОК</span><ArrowLeft size={18} /></button>
            <p className="button-hint">END OF FILE // NOT THE END OF OUR STORY</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}