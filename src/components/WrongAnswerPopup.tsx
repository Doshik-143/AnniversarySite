
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeartCrack } from "lucide-react";

type WrongAnswerPopupProps = {
    show: boolean;
    onHide: () => void;
};

const reactions = [
    {
        gif: "/images/reactions/reaction-01.gif",
        text: "АХАХАХ, ні 😂 Спробуй ще раз!",
    },
    {
        gif: "/images/reactions/reaction-02.gif",
        text: "Ти це зараз серйозно? 😭",
    },
    {
        gif: "/images/reactions/reaction-03.gif",
        text: "Система трохи розчарована... 💔",
    },
    {
        gif: "/images/reactions/reaction-04.gif",
        text: "Ммм, цікава теорія 😂",
    },
    {
        gif: "/images/reactions/reaction-05.gif",
        text: "Не вгадав, коханий 💗",
    },
    {
        gif: "/images/reactions/reaction-06.gif",
        text: "Мозковий процес призупинено 😭",
    },
];

const messages = [
    "АХАХАХ, ні 😂 Спробуй ще раз!",
    "Ти це зараз серйозно? 😭",
    "Система трохи розчарована... 💔",
    "Ммм, цікава теорія 😂",
    "Не вгадав, коханий 💗",
    "Мозковий процес призупинено 😭",
    "Ну майже... хоча ні 😂",
    "Подумай ще трошечки, сонечко 💗",
];

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

export default function WrongAnswerPopup({
    show,
    onHide,
}: WrongAnswerPopupProps) {
    const [reaction, setReaction] = useState(() => pickRandom(reactions));
    const [message, setMessage] = useState(() => pickRandom(messages));

    useEffect(() => {
        if (!show) return;

        setReaction(pickRandom(reactions));
        setMessage(pickRandom(messages));

        const timer = window.setTimeout(onHide, 2500);

        return () => window.clearTimeout(timer);
    }, [show, onHide]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="reaction-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="reaction-popup"
                        role="status"
                        initial={{ opacity: 0, scale: 0.75, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 10 }}
                        transition={{ duration: 0.25 }}
                    >
                        <div className="reaction-title">
                            <HeartCrack size={18} />
                            <span>НЕПРАВИЛЬНА ВІДПОВІДЬ</span>
                        </div>

                        <img
                            className="reaction-gif"
                            src={reaction.gif}
                            alt="Смішна реакція"
                        />

                        <p className="reaction-text">{message}</p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}