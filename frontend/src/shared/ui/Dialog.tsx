import { AnimatePresence, motion } from "motion/react"
import { createContext, useContext, useEffect, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Xmark } from "iconoir-react"
import Heading from "./Heading"
import { cn } from "@/shared/utils/cn"

interface DialogContextValue {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
    const context = useContext(DialogContext);
    if (!context) throw new Error("Dialog components must be used within <Dialog>");
    return context;
}

interface DialogProps extends DialogContextValue {
    children: ReactNode;
}

export const Dialog = ({ open, onOpenChange, children }: DialogProps) => (
    <DialogContext.Provider value={{ open, onOpenChange }}>
        {children}
    </DialogContext.Provider>
);

interface DialogContentProps {
    className?: string;
    children: ReactNode;
}

export const DialogContent = ({ className = "", children }: DialogContentProps) => {
    const { open, onOpenChange } = useDialogContext();

    useEffect(() => {
        if (!open) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onOpenChange]);

    return createPortal(
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-90 bg-black blur-glass"
                        onClick={() => onOpenChange(false)}
                    />

                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn("fixed top-1/2 left-1/2 z-100 w-[80%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-stroke-subtle bg-ui-card shadow-detail-md", className)}
                    >
                        <DialogClose />
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};

export const DialogClose = ({ className = "" }: { className?: string }) => {
    const { onOpenChange } = useDialogContext();

    return (
        <button
            type="button"
            onClick={() => onOpenChange(false)}
            className={cn("absolute right-4 top-4 rounded-full p-1 cursor-pointer text-content-muted transition-colors hover:bg-ui-elevated hover:text-content", className)}
        >
            <Xmark width={16} height={16} strokeWidth={2} />
            <span className="sr-only">Close</span>
        </button>
    );
};

export const DialogHeader = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div className={cn("flex flex-col gap-1 p-5", className)}>{children}</div>
);

export const DialogTitle = ({ children }: { children: ReactNode }) => (
    <Heading level={3} className="mb-0 pr-6">{children}</Heading>
);

export const DialogDescription = ({ children }: { children: ReactNode }) => (
    <p className="text-body-sm text-content-muted">{children}</p>
);

export const DialogBody = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div className={cn("px-5 pb-5", className)}>{children}</div>
);

export const DialogFooter = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
    <div className={cn("flex justify-end gap-2 border-t border-stroke-subtle px-5 py-4", className)}>{children}</div>
);
