import { useEffect, useState } from "react";
import {
    FolderHeart,
    Terminal,
    Film,
    Package,
    Images,
    Star,
    Heart,
    Wifi,
    BatteryFull,
    X,
    Minus,
    Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AppInfo = {
    id: string;
    name: string;
    icon: typeof Heart;
    description: string;
};

const apps: AppInfo[] = [
    {
        id: "universe",
        name: "OUR UNIVERSE",
        icon: Star,
        description: "Наш маленький космос і спогади.",
    },
    {
        id: "console",
        name: "Console",
        icon: Terminal,
        description: "Секретна консоль LOVE OS.",
    },
    {
        id: "kino",
        name: "Kino.exe",
        icon: Film,
        description: "Місце для нашого відео.",
    },
    {
        id: "drop",
        name: "CS.GO2_DROP",
        icon: Package,
        description: "Відкрий свій особливий кейс.",
    },
    {
        id: "loveis",
        name: "LoveIS.exe",
        icon: Heart,
        description: "Трохи любові у фотографіях.",
    },
    {
        id: "memories",
        name: "Memories",
        icon: Images,
        description: "Архів наших моментів.",
    },
];

export default function Desktop() {
    const [activeApp, setActiveApp] = useState<AppInfo | null>(null);
    const [time, setTime] = useState(() => new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setTime(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);

    const floatingHearts = Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${(index * 47 + 13) % 100}%`,
        top: `${(index * 67 + 19) % 100}%`,
        size: 10 + ((index * 7) % 15),
        duration: 3 + ((index * 13) % 40) / 10,
        delay: ((index * 17) % 30) / 10,
    }));

    return (
        <div className="love-desktop">
            <div className="desktop-hearts" aria-hidden="true">
                {floatingHearts.map((heart) => (
                    <motion.span
                        key={heart.id}
                        className="floating-heart"
                        style={{
                            left: heart.left,
                            top: heart.top,
                            fontSize: heart.size,
                        }}
                        initial={{ opacity: 0.08, y: 0, scale: 0.8 }}
                        animate={{
                            opacity: [0.08, 0.45, 0.12, 0.6, 0.08],
                            y: [0, -12, 4, -8, 0],
                            scale: [0.8, 1.1, 0.9, 1.15, 0.8],
                        }}
                        transition={{
                            duration: heart.duration,
                            delay: heart.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        ♥
                    </motion.span>
                ))}
            </div>

            <div className="desktop-glow desktop-glow-one" />
            <div className="desktop-glow desktop-glow-two" />

            <header className="desktop-topbar">
                <div className="desktop-brand">
                    <Heart size={17} fill="currentColor" />
                    <span>LOVE OS</span>
                </div>

                <div className="desktop-status">
                    <span className="desktop-status-dot" />
                    SYSTEM RUNNING
                </div>
            </header>

            <div className="desktop-app-grid">
                {apps.map((app, index) => {
                    const Icon = app.icon;

                    return (
                        <motion.button
                            key={app.id}
                            className="desktop-app"
                            onClick={() => setActiveApp(app)}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                            whileHover={{ y: -4, scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            <span className="desktop-app-icon">
                                <Icon size={27} />
                            </span>
                            <span className="desktop-app-name">{app.name}</span>
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {activeApp && (
                    <motion.div
                        className="desktop-window"
                        initial={{ opacity: 0, scale: 0.92, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 8 }}
                    >
                        <div className="desktop-window-header">
                            <div className="desktop-window-title">
                                <activeApp.icon size={16} />
                                <span>{activeApp.name}</span>
                            </div>

                            <div className="desktop-window-controls">
                                <button
                                    aria-label="Згорнути вікно"
                                    onClick={() => setActiveApp(null)}
                                >
                                    <Minus size={15} />
                                </button>
                                <button
                                    aria-label="Розгорнути вікно"
                                    onClick={() => setActiveApp(null)}
                                >
                                    <Maximize2 size={14} />
                                </button>
                                <button
                                    aria-label="Закрити вікно"
                                    onClick={() => setActiveApp(null)}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="desktop-window-content">
                            <div className="desktop-window-heart">
                                <activeApp.icon size={32} />
                            </div>
                            <h2>{activeApp.name}</h2>
                            <p>{activeApp.description}</p>
                            <span className="desktop-coming-soon">
                                APPLICATION INITIALIZED
                            </span>
                            <p className="desktop-window-note">
                                Ця програма скоро оживе 💗
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="desktop-taskbar">
                <div className="taskbar-system">
                    <span className="taskbar-logo">
                        <Heart size={19} fill="currentColor" />
                    </span>
                    <span className="taskbar-divider" />
                    <span className="taskbar-running">
                        <FolderHeart size={17} />
                        <span>LOVE OS</span>
                    </span>
                </div>

                <div className="taskbar-info">
                    <Wifi size={16} />
                    <BatteryFull size={17} />
                    <div className="taskbar-clock">
                        <span>
                            {time.toLocaleTimeString("uk-UA", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                        <span>
                            {time.toLocaleDateString("uk-UA", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>
            </footer>
        </div>
    );
}