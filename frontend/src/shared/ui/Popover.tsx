import { AnimatePresence, motion } from "motion/react";
import { createContext, useContext, useEffect, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { cn } from "@/shared/utils/cn";

interface PopoverContextValue {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

export const usePopover = () => {
    const context = useContext(PopoverContext);
    if (!context)
        throw new Error("Popover components must be used within <Popover>");
    return context;
};

interface PopoverProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
    className?: string;
}

/**
 * A click-to-toggle floating panel anchored to a trigger — outside-click
 * and Escape both close it. Works uncontrolled (just render it) or
 * controlled (pass `open`/`onOpenChange`).
 */
export const Popover = ({ open, onOpenChange, children, className }: PopoverProps) => {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = open !== undefined;
    const isOpen = isControlled ? open : internalOpen;

    const setIsOpen: Dispatch<SetStateAction<boolean>> = (next) => {
        const resolved = typeof next === "function" ? (next as (prev: boolean) => boolean)(isOpen) : next;
        if (!isControlled) setInternalOpen(resolved);
        onOpenChange?.(resolved);
    };

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
        <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
            {/* Split in two: `className` (e.g. "absolute right-5", to place the
                whole trigger+popover unit within an ancestor) and the popover's
                own required "relative" anchor (for PopoverContent's "absolute"
                to position against) would otherwise fight over `position` on
                the same element with no reliable winner. */}
            <div className={className}>
                <div ref={rootRef} className="relative">
                    {children}
                </div>
            </div>
        </PopoverContext.Provider>
    );
};

interface PopoverTriggerProps {
    children: ReactNode;
}

// A plain click-capturing wrapper rather than cloning the child: the trigger
// is often a component (Button, Tooltip>button) that doesn't forward an
// injected onClick down to its own inner element, but a click anywhere
// inside still bubbles up here regardless of what's nested below.
// `display: contents` keeps it invisible to layout.
export const PopoverTrigger = ({ children }: PopoverTriggerProps) => {
    const { setIsOpen } = usePopover();

    return (
        <span className="contents" onClick={() => setIsOpen((prev) => !prev)}>
            {children}
        </span>
    );
};

interface PopoverContentProps {
    children: ReactNode;
    className?: string;
    align?: "start" | "end";
}

const ALIGN_CLASS = { start: "left-0", end: "right-0" } as const;
const ALIGN_ORIGIN = { start: "top left", end: "top right" } as const;

export const PopoverContent = ({ children, className, align = "end" }: PopoverContentProps) => {
    const { isOpen } = usePopover();

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    role="dialog"
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -4 }}
                    transition={{ type: "spring", stiffness: 600, damping: 40 }}
                    style={{ transformOrigin: ALIGN_ORIGIN[align] }}
                    className={cn(
                        "absolute top-full z-30 mt-2 overflow-hidden rounded-2xl border border-stroke-subtle bg-ui-card/70 shadow-md backdrop-blur-lg",
                        ALIGN_CLASS[align],
                        className
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const PopoverHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cn("px-4 py-3", className)}>
        {children}
    </div>
);
