import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./Button";
import { ShortcutHint, type Shortcut } from "./ShortcutHint";
import { cn } from "@/shared/utils/cn";

export interface Hint {
    label: string;
    shortcuts: Shortcut[];
}

interface HintsPopoverProps {
    hints: Hint[];
    className?: string;
}

// Generic "explain the shortcuts for this section" button + anchored popup.
// Meant to be dropped into any section header with that section's own hint list.
export const HintsPopover = ({ hints, className }: HintsPopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointer = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
        };
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointer);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("pointerdown", handlePointer);
            document.removeEventListener("keydown", handleKey);
        };
    }, [isOpen]);

    useEffect(() => {
        const handleShortcut = (e: KeyboardEvent) => {
            if (!e.shiftKey || e.key.toLowerCase() !== "h") return;

            const activeElement = document.activeElement?.tagName.toLowerCase();
            if (activeElement === "input" || activeElement === "textarea") return;

            e.preventDefault();
            setIsOpen((prev) => !prev);
        };

        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, []);

    return (
        <div ref={rootRef} className={cn("", className)}>
            <Button
                onClick={() => setIsOpen((prev) => !prev)}
                className="rounded-lg border border-stroke-subtle bg-accent-secondary-soft"
            >
                Hints
                <ShortcutHint shortcuts={["shift+h"]} />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        role="dialog"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        style={{ transformOrigin: "top right" }}
                        className="absolute right-0 top-full z-20 mt-2 w-max min-w-56 overflow-hidden rounded-2xl border-2 border-stroke-strong/60 bg-ui-card/50 p-2 shadow-md backdrop-blur-lg"
                    >
                        <ul className="flex flex-col gap-1">
                            {hints.map((hint) => (
                                <li key={hint.label} className="flex items-center justify-between gap-6 px-3 py-1.5">
                                    <span className="text-label text-content">{hint.label}</span>
                                    <ShortcutHint shortcuts={hint.shortcuts} />
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
