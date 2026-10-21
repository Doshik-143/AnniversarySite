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

type AppWindowState = {
    app: AppInfo;
    minimized: boolean;
    maximized: boolean;
    x: number;
    y: number;
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
    const [windows, setWindows] = useState<AppWindowState[]>([]);
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

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

    function openApp(app: AppInfo) {
        setWindows((previous) => {
            const existing = previous.find((window) => window.app.id === app.id);

            if (existing) {
                return previous.map((window) =>
                    window.app.id === app.id
                        ? { ...window, minimized: false }
                        : window
                );
            }

            return [
                ...previous,
                {
                    app,
                    minimized: false,
                    maximized: false,
                    x: 0,
                    y: 0,
                },
            ];
        });

        setActiveWindowId(app.id);
    }

    function minimizeWindow(id: string) {
        setWindows((previous) =>
            previous.map((window) =>
                window.app.id === id
                    ? { ...window, minimized: true }
                    : window
            )
        );

        setActiveWindowId((previous) => previous === id ? null : previous);
    }

    function toggleMaximize(id: string) {
        setWindows((previous) =>
            previous.map((window) =>
                window.app.id === id
                    ? { ...window, maximized: !window.maximized }
                    : window
            )
        );

        setActiveWindowId(id);
    }

    function closeWindow(id: string) {
        setWindows((previous) =>
            previous.filter((window) => window.app.id !== id)
        );

        setActiveWindowId((previous) => previous === id ? null : previous);
    }

    function restoreWindow(id: string) {
        setWindows((previous) =>
            previous.map((window) =>
                window.app.id === id
                    ? { ...window, minimized: false }
                    : window
            )
        );

        setActiveWindowId(id);
    }

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
                            onClick={() => openApp(app)}
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
                {windows.map((window) => {
                    const { app, minimized, maximized, x, y } = window;
                    const Icon = app.icon;

                    if (minimized) return null;

                    return (
                        <motion.div
                            key={app.id}
                            className={`desktop-window${maximized ? " maximized" : ""}`}
                            drag={!maximized}
                            dragMomentum={false}
                            dragElastic={0}
                            onPointerDown={() => setActiveWindowId(app.id)}
                            style={{
                                x: maximized ? 0 : x,
                                y: maximized ? 0 : y,
                                zIndex: activeWindowId === app.id ? 20 : 10,
                            }}
                            onDragEnd={(_, info) => {
                                setWindows((previous) =>
                                    previous.map((item) =>
                                        item.app.id === app.id
                                            ? {
                                                ...item,
                                                x: item.x + info.offset.x,
                                                y: item.y + info.offset.y,
                                            }
                                            : item
                                    )
                                );
                            }}
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                        >
                            <div className="desktop-window-header">
                                <div className="desktop-window-title">
                                    <Icon size={16} />
                                    <span>{app.name}</span>
                                </div>

                                <div className="desktop-window-controls">
                                    <button
                                        aria-label="Згорнути вікно"
                                        onPointerDown={(event) => event.stopPropagation()}
                                        onClick={() => minimizeWindow(app.id)}
                                    >
                                        <Minus size={15} />
                                    </button>

                                    <button
                                        aria-label={maximized ? "Відновити розмір" : "Розгорнути вікно"}
                                        onPointerDown={(event) => event.stopPropagation()}
                                        onClick={() => toggleMaximize(app.id)}
                                    >
                                        <Maximize2 size={14} />
                                    </button>

                                    <button
                                        aria-label="Закрити вікно"
                                        onPointerDown={(event) => event.stopPropagation()}
                                        onClick={() => closeWindow(app.id)}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="desktop-window-content">
                                <div className="desktop-window-heart">
                                    <Icon size={32} />
                                </div>
                                <h2>{app.name}</h2>
                                <p>{app.description}</p>
                                <span className="desktop-coming-soon">
                                    APPLICATION INITIALIZED
                                </span>
                                <p className="desktop-window-note">
                                    Ця програма скоро оживе 💗
                                </p>
                            </div>
                        </motion.div>
                    );
                })}
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

                <div className="taskbar-open-apps">
                    {windows.map((window) => {
                        const Icon = window.app.icon;

                        return (
                            <button
                                key={window.app.id}
                                className={`taskbar-app ${activeWindowId === window.app.id && !window.minimized
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() => {
                                    if (window.minimized || activeWindowId !== window.app.id) {
                                        restoreWindow(window.app.id);
                                    } else {
                                        minimizeWindow(window.app.id);
                                    }
                                }}
                                title={window.app.name}
                            >
                                <Icon size={17} />
                            </button>
                        );
                    })}
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