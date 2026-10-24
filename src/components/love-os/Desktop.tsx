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
import { Bell, Power } from "lucide-react";
import OurUniverse from "./apps/OurUniverse/OurUniverse";
import { WindowItem } from "./WindowItem";
import Drop from "./apps/Drop/Drop";

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
        id: "our-universe",
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

    const [contextMenu, setContextMenu] = useState<{
        appId: string;
        x: number;
        y: number;
    } | null>(null);

    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

    const [ip, setIp] = useState<string>("Завантаження...");

    useEffect(() => {
        // Отримуємо IP-адресу через безкоштовне API
        fetch("https://api.ipify.org?format=json")
            .then((res) => res.json())
            .then((data) => setIp(data.ip))
            .catch((err) => {
                console.error("Помилка отримання IP:", err);
                setIp("Не визначено");
            });
    }, []);

    const [isShuttingDown, setIsShuttingDown] = useState(false);

    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isCharging, setIsCharging] = useState(false);

    const [time, setTime] = useState(() => new Date());

    useEffect(() => {
        const timer = window.setInterval(() => setTime(new Date()), 1000);
        return () => window.clearInterval(timer);
    }, []);


    useEffect(() => {
        let battery: {
            level: number;
            charging: boolean;
            addEventListener: (event: string, callback: () => void) => void;
            removeEventListener: (event: string, callback: () => void) => void;
        } | null = null;

        const updateBattery = () => {
            if (!battery) return;

            setBatteryLevel(Math.round(battery.level * 100));
            setIsCharging(battery.charging);
        };

        const getBattery = async () => {
            try {
                const batteryNavigator = navigator as Navigator & {
                    getBattery?: () => Promise<NonNullable<typeof battery>>;
                };

                if (!batteryNavigator.getBattery) return;

                battery = await batteryNavigator.getBattery();
                updateBattery();

                battery.addEventListener("levelchange", updateBattery);
                battery.addEventListener("chargingchange", updateBattery);
            } catch {
                setBatteryLevel(null);
            }
        };

        void getBattery();

        return () => {
            if (battery) {
                battery.removeEventListener("levelchange", updateBattery);
                battery.removeEventListener("chargingchange", updateBattery);
            }
        };
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

    function onShutdown() {
        setIsShuttingDown(true);
    }

    return (
        <div className="love-desktop">
            <AnimatePresence>
                {isShuttingDown && (
                    <motion.div
                        className="os-shutdown-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <Heart size={42} fill="currentColor" />
                        <h1>LOVE OS</h1>
                        <p>Завершуємо нашу маленьку сесію...</p>
                        <span>IT WAS NICE HAVING YOU HERE ♥</span>

                        <button onClick={() => setIsShuttingDown(false)}>
                            Повернутися до системи
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

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
                    const { app, minimized } = window;

                    if (minimized) return null;

                    return (
                        <WindowItem
                            key={app.id}
                            window={window}
                            isActive={activeWindowId === app.id}
                            onActivate={() => setActiveWindowId(app.id)}
                            onMinimize={() => minimizeWindow(app.id)}
                            onToggleMaximize={() => toggleMaximize(app.id)}
                            onClose={() => closeWindow(app.id)}
                            onDragEnd={(info) => {
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
                        >
                            {app.id === "our-universe" ? (
                                <OurUniverse />
                            ) : app.id === "drop" ? (
                                <Drop />
                            ) : (
                                <>
                                    <div className="desktop-window-heart">
                                        <app.icon size={32} />
                                    </div>
                                    <h2>{app.name}</h2>
                                    <p>{app.description}</p>
                                    <span className="desktop-coming-soon">
                                        APPLICATION INITIALIZED
                                    </span>
                                    <p className="desktop-window-note">
                                        Ця програма скоро оживе 💗
                                    </p>
                                </>
                            )}
                        </WindowItem>
                    );
                })}
            </AnimatePresence>

            <footer className="desktop-taskbar">
                <div className="taskbar-system">
                    <button
                        className={`taskbar-logo start-button-icon ${startMenuOpen ? "selected" : ""
                            }`}
                        onClick={() => {
                            setStartMenuOpen((previous) => !previous);
                            setNotificationsOpen(false);
                        }}
                        aria-label="Відкрити меню LOVE OS"
                        aria-expanded={startMenuOpen}
                    >
                        <Heart size={19} fill="currentColor" />
                    </button>
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
                                onContextMenu={(event) => {
                                    event.preventDefault();

                                    setContextMenu({
                                        appId: window.app.id,
                                        x: Math.max(
                                            8,
                                            Math.min(event.clientX, globalThis.innerWidth - 198)
                                        ),
                                        y: Math.max(
                                            8,
                                            Math.min(event.clientY, globalThis.innerHeight - 188)
                                        ),
                                    });
                                }}
                                title={window.app.name}
                            >
                                <Icon size={17} />
                            </button>
                        );
                    })}
                </div>

                <div className="taskbar-info">
                    <button
                        className={`taskbar-notifications ${notificationsOpen ? "selected" : ""
                            }`}
                        onClick={() => {
                            setNotificationsOpen((previous) => !previous);
                            setStartMenuOpen(false);
                        }}
                        aria-label="Центр сповіщень"
                        aria-expanded={notificationsOpen}
                    >
                        <Bell size={17} />
                        <span className="notification-dot" />
                    </button>
                    <Wifi size={16} />
                    <span
                        className="taskbar-battery"
                        title={
                            batteryLevel === null
                                ? "Інформація про батарею недоступна"
                                : `Заряд батареї: ${batteryLevel}%${isCharging ? " · Заряджається" : ""
                                }`
                        }
                    >
                        <BatteryFull size={17} />
                    </span>
                    <div
                        className="taskbar-clock"
                        title={`${time.toLocaleDateString("uk-UA", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                        })}\n${time.toLocaleTimeString("uk-UA", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })} (Місцевий час)`}
                    >
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

            <AnimatePresence>
                {startMenuOpen && (
                    <motion.div
                        className="start-menu"
                        initial={{ opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    >
                        <div className="start-menu-heading">
                            <div className="start-menu-heart">
                                <Heart size={24} fill="currentColor" />
                            </div>
                            <div>
                                <h2>Привіт, коханий 💗</h2>
                                <p>Ласкаво просимо у наш світ</p>
                            </div>
                        </div>

                        <div className="start-menu-section">
                            <span>ТВОЇ ПРОГРАМИ</span>

                            {apps.map((app) => {
                                const Icon = app.icon;

                                return (
                                    <button
                                        key={app.id}
                                        className="start-menu-app"
                                        onClick={() => {
                                            openApp(app);
                                            setStartMenuOpen(false);
                                        }}
                                    >
                                        <Icon size={19} />
                                        <span>{app.name}</span>
                                    </button>
                                );
                            })}
                        </div>


                        <div className="start-menu-footer">
                            <span className="start-menu-ip">
                                IP: {ip}
                            </span>

                            <div className="start-menu-footer-actions">
                                <Heart size={14} fill="currentColor" />

                                <button
                                    className="start-menu-power"
                                    aria-label="Вимкнути LOVE OS"
                                    title="Вимкнути LOVE OS"
                                    onClick={() => {
                                        setStartMenuOpen(false);
                                        onShutdown();
                                    }}
                                >
                                    <Power size={17} />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {notificationsOpen && (
                    <motion.div
                        className="notification-center"
                        initial={{ opacity: 0, y: 12, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    >
                        <div className="notification-heading">
                            <h2>Сповіщення</h2>
                            <button
                                onClick={() => setNotificationsOpen(false)}
                                aria-label="Закрити сповіщення"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <div className="love-notification">
                            <div className="notification-icon">
                                <Heart size={19} fill="currentColor" />
                            </div>

                            <div className="notification-message">
                                <div className="notification-app-name">
                                    LOVE.exe // REMINDER
                                </div>
                                <p>Люблю тебе♥</p>
                                <span>Просто нагадування для найкращого 💗</span>
                            </div>
                        </div>

                        <div className="notification-bottom">
                            НАДІСЛАНО З ЛЮБОВ'Ю · ♥
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {contextMenu && (
                    <>
                        <motion.div
                            className="context-menu-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setContextMenu(null)}
                            onContextMenu={(event) => {
                                event.preventDefault();
                                setContextMenu(null);
                            }}
                        />

                        <motion.div
                            className="os-context-menu"
                            style={{
                                left: contextMenu.x,
                                top: contextMenu.y,
                            }}
                            initial={{ opacity: 0, scale: 0.95, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        >
                            {(() => {
                                const target = windows.find(
                                    (item) => item.app.id === contextMenu.appId
                                );

                                if (!target) return null;

                                return (
                                    <>
                                        <div className="context-menu-title">
                                            {target.app.name}
                                        </div>

                                        <button
                                            onClick={() => {
                                                restoreWindow(target.app.id);
                                                setContextMenu(null);
                                            }}
                                        >
                                            <FolderHeart size={15} />
                                            Відкрити / Відновити
                                        </button>

                                        {!target.minimized && (
                                            <>
                                                <button
                                                    onClick={() => {
                                                        minimizeWindow(target.app.id);
                                                        setContextMenu(null);
                                                    }}
                                                >
                                                    <Minus size={15} />
                                                    Згорнути
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        toggleMaximize(target.app.id);
                                                        setContextMenu(null);
                                                    }}
                                                >
                                                    <Maximize2 size={15} />
                                                    {target.maximized
                                                        ? "Відновити розмір"
                                                        : "Розгорнути"}
                                                </button>
                                            </>
                                        )}

                                        <div className="context-menu-divider" />

                                        <button
                                            className="context-menu-close"
                                            onClick={() => {
                                                closeWindow(target.app.id);
                                                setContextMenu(null);
                                            }}
                                        >
                                            <X size={15} />
                                            Закрити вікно
                                        </button>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}