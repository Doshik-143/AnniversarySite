import { useState } from "react";
import { motion } from "framer-motion";
import "./Drop.css";

export default function Drop() {
    const [isOpening, setIsOpening] = useState(false);

    return (
        <section className="drop-app">
            <header className="drop-header">
                <div className="drop-logo">CS2</div>

                <div>
                    <span className="drop-eyebrow">
                        LOVE OS // CASE SYSTEM
                    </span>
                    <h1>CS.GO2_DROP</h1>
                </div>
            </header>

            <div className="drop-content">
                <span className="drop-status">
                    {isOpening ? "CASE OPENING..." : "READY TO OPEN"}
                </span>

                <motion.div
                    className="drop-case"
                    animate={
                        isOpening
                            ? { y: [0, -8, 0], rotate: [0, -2, 2, 0] }
                            : { y: 0, rotate: 0 }
                    }
                    transition={{
                        duration: 0.45,
                        repeat: isOpening ? Infinity : 0,
                    }}
                >
                    <div className="drop-case-glow" />
                    <div className="drop-case-icon">?</div>
                    <span>LOVE CASE</span>
                </motion.div>

                <p className="drop-description">
                    Усередині захований твій особливий дроп.
                </p>

                <button
                    className="drop-open-button"
                    disabled={isOpening}
                    onClick={() => setIsOpening(true)}
                >
                    {isOpening ? "ВІДКРИВАЄМО..." : "ВІДКРИТИ КЕЙС"}
                </button>
            </div>

            <footer className="drop-footer">
                <span>CS.GO2_DROP.exe</span>
                <span>MADE WITH LOVE ♥</span>
            </footer>
        </section>
    );
}