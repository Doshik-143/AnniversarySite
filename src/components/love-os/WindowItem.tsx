import { motion, useDragControls, type PanInfo } from "framer-motion";
import { Minus, Maximize2, X } from "lucide-react";

type WindowProps = {
    window: any;
    isActive: boolean;
    onActivate: () => void;
    onDragEnd: (info: PanInfo) => void;
    onMinimize: () => void;
    onToggleMaximize: () => void;
    onClose: () => void;
    children: React.ReactNode;
};

export function WindowItem({
    window,
    isActive,
    onActivate,
    onDragEnd,
    onMinimize,
    onToggleMaximize,
    onClose,
    children,
}: WindowProps) {
    const { app, maximized, x, y } = window;
    const Icon = app.icon;

    const dragControls = useDragControls();

    return (
        <motion.div
            className={`desktop-window${maximized ? " maximized" : ""}`}
            drag={!maximized}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            onPointerDown={onActivate}
            style={{
                x: maximized ? 0 : x,
                y: maximized ? 0 : y,
                zIndex: isActive ? 20 : 10,
            }}
            onDragEnd={(_, info) => onDragEnd(info)}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
        >
            <div
                className="desktop-window-header"
                style={{ cursor: maximized ? "default" : "grab" }}
                onPointerDown={(event) => {
                    dragControls.start(event);
                }}
            >
                <div className="desktop-window-title">
                    <Icon size={16} />
                    <span>{app.name}</span>
                </div>

                <div className="desktop-window-controls">
                    <button
                        aria-label="Згорнути вікно"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={onMinimize}
                    >
                        <Minus size={15} />
                    </button>

                    <button
                        aria-label={maximized ? "Відновити розмір" : "Розгорнути вікно"}
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={onToggleMaximize}
                    >
                        <Maximize2 size={14} />
                    </button>

                    <button
                        aria-label="Закрити вікно"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={onClose}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
            
            <div className="desktop-window-content">
                {children}
            </div>
        </motion.div>
    );
}