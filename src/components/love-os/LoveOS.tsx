import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Power } from "lucide-react";
import "./LoveOS.css";

type LoveOSProps = {
    onExit: () => void;
};

type BootPhase = "off" | "booting" | "splash" | "desktop";

export default function LoveOS({ onExit }: LoveOSProps) {
    const [phase, setPhase] = useState<BootPhase>("off");

    function startSystem() {
        if (phase !== "off") return;
        setPhase("booting");
    }

    return (
        <main className="love-os">
            <AnimatePresence mode="wait">
                {phase === "off" && (
                    <motion.section
                        key="power-off"
                        className="os-power-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p className="os-label">LOVE OS // SYSTEM OFF</p>

                        <motion.button
                            className="os-power-button"
                            onClick={startSystem}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.92 }}
                            aria-label="Увімкнути LOVE OS"
                        >
                            <Power size={42} />
                        </motion.button>

                        <h1>Увімкнути LOVE OS?</h1>
                        <p className="os-subtitle">
                            Здається, тут іще залишилося дещо особливе...
                        </p>
                        <p className="os-hint">PRESS TO POWER ON</p>
                    </motion.section>
                )}

                {phase === "booting" && (
                    <motion.section
                        key="booting"
                        className="os-boot-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <p>LOVE OS BIOS v6.0</p>
                        <p>Initializing love.exe...</p>
                        <p>Loading memories... <span>OK</span></p>
                        <p>Checking heart connection... <span>OK</span></p>
                        <p>Player detected: MY FAVORITE PERSON</p>

                        <motion.div
                            className="os-progress"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 2.5, ease: "linear" }}
                            onAnimationComplete={() => setPhase("splash")}
                        />
                        <p className="os-hint">PLEASE WAIT...</p>
                    </motion.section>
                )}

                {phase === "splash" && (
                    <motion.section
                        key="splash"
                        className="os-splash-screen"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        onAnimationComplete={() => {
                            window.setTimeout(() => setPhase("desktop"), 1800);
                        }}
                    >
                        <motion.div
                            className="os-logo-heart"
                            animate={{ scale: [1, 1.12, 1] }}
                            transition={{ duration: 1.4, repeat: Infinity }}
                        >
                            ♥
                        </motion.div>
                        <h1>LOVE OS</h1>
                        <p>SIX YEARS IN THE MAKING</p>
                        <p>A WORLD MADE FOR TWO</p>
                        <h2>WELCOME HOME.</h2>
                    </motion.section>
                )}

                {phase === "desktop" && (
                    <motion.section
                        key="desktop"
                        className="os-desktop-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="os-label">LOVE OS // SYSTEM RUNNING</p>
                        <h1>Наш маленький всесвіт 💗</h1>
                        <p>Робочий стіл завантажено. Продовження незабаром...</p>
                        <button className="os-exit-button" onClick={onExit}>
                            Вийти з LOVE OS
                        </button>
                    </motion.section>
                )}
            </AnimatePresence>
        </main>
    );
}