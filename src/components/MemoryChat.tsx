import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Heart, X } from "lucide-react";

type MemoryChatProps = {
    open: boolean;
    onClose: () => void;
};

const chatMessages = [
    { sender: "him", text: "Не лайкай пж, бо я сплю" },
    { sender: "me", text: "Привіт, ну ладно)" },
    { sender: "me", text: "А ти хто?)" },
    { sender: "him", text: ")))" },
] as const;

export default function MemoryChat({
    open,
    onClose,
}: MemoryChatProps) {
    const [visibleMessages, setVisibleMessages] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    function closeChat() {
        setVisibleMessages(0);
        setIsTyping(false);
        onClose();
    }

    function showNextMessage() {
        if (visibleMessages >= chatMessages.length || isTyping) return;

        const nextMessage = chatMessages[visibleMessages];

        if (nextMessage.sender === "him") {
            setIsTyping(true);

            window.setTimeout(() => {
                setIsTyping(false);
                setVisibleMessages((previous) => previous + 1);
            }, 900);

            return;
        }

        setVisibleMessages((previous) => previous + 1);
    }

    return (
        <AnimatePresence
            onExitComplete={() => {
                setVisibleMessages(0);
                setIsTyping(false);
            }}
        >
            {open && (
                <motion.div
                    className="chat-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeChat}
                >
                    <motion.div
                        className="chat-window"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="chat-title"
                        initial={{ opacity: 0, scale: 0.88, y: 28 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 18 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="chat-header">
                            <div className="chat-header-icon">
                                <Heart size={20} />
                            </div>

                            <div className="chat-header-text">
                                <span>LOVE.exe // PRIVATE CHAT</span>
                                <h3 id="chat-title">Наш перший діалог 💗</h3>
                            </div>

                            <button
                                type="button"
                                className="chat-close"
                                onClick={closeChat}
                                aria-label="Закрити чат"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="chat-body">
                            <p className="chat-date">
                                ПОВІДОМЛЕННЯ З АРХІВУ СПОГАДІВ
                            </p>

                            {chatMessages.slice(0, visibleMessages).map((message, index) => (
                                <motion.div
                                    key={index}
                                    className={`chat-message-row ${message.sender === "me" ? "my-message" : "his-message"
                                        }`}
                                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="chat-message">
                                        <p>{message.text}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    className="chat-typing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <span />
                                    <span />
                                    <span />
                                </motion.div>
                            )}

                            {visibleMessages === 0 && !isTyping && (
                                <p className="chat-intro">
                                    Одне повідомлення. Історія на шість років. ✨
                                </p>
                            )}
                        </div>

                        <div className="chat-footer">
                            {visibleMessages < chatMessages.length ? (
                                <button
                                    type="button"
                                    className="start-button chat-next-button"
                                    disabled={isTyping}
                                    onClick={showNextMessage}
                                >
                                    <span>
                                        {visibleMessages === 0
                                            ? "ВІДКРИТИ ПОВІДОМЛЕННЯ"
                                            : "НАСТУПНЕ ПОВІДОМЛЕННЯ"}
                                    </span>
                                    <ArrowRight size={18} />
                                </button>
                            ) : (
                                <div className="chat-ending">
                                    <Heart size={18} />
                                    <p>І хто б міг подумати, до чого це приведе…</p>

                                    <button
                                        type="button"
                                        className="start-button chat-next-button"
                                        onClick={closeChat}
                                    >
                                        <span>ПОВЕРНУТИСЯ ДО СПОГАДУ</span>
                                        <ArrowLeft size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}