import type { ReactNode } from "react";
import { KeyCommand, Plus } from "iconoir-react";
import { cn } from "@/shared/utils/cn";

export type Shortcut = string | ReactNode;

interface ShortcutHintProps {
    shortcuts: Shortcut[];
    className?: string;
}

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/.test(navigator.platform);

function renderKey(token: string): ReactNode {
    switch (token.toLowerCase()) {
        case "mod":
            // Matches the `e.ctrlKey || e.metaKey` check used to wire up the actual listener.
            return isMac ? <KeyCommand width={12} height={12} /> : <span>Ctrl</span>;
        case "cmd":
        case "command":
        case "meta":
            return <KeyCommand width={12} height={12} />;
        case "ctrl":
        case "control":
            return <span>Ctrl</span>;
        case "shift":
            return <span>⇧</span>;
        case "alt":
        case "option":
            return <span>⌥</span>;
        default:
            return <span>{token.length === 1 ? token.toUpperCase() : token}</span>;
    }
}

function renderShortcut(shortcut: Shortcut): ReactNode {
    if (typeof shortcut !== "string") return shortcut;

    return shortcut.split("+").filter(Boolean).map((key, i) => (
        <span key={i} className="flex items-center gap-0.5">
            {i > 0 && <Plus width={10} height={10} />}
            {renderKey(key)}
        </span>
    ));
}

export const ShortcutHint = ({ shortcuts, className = "" }: ShortcutHintProps) => {
    const shortcutStyle = "flex items-center gap-0.5 border border-accent-secondary-soft rounded-lg bg-accent-secondary-soft px-2 py-0.5 text-label text-content-muted";

    return (
        <span className={cn("flex items-center gap-1", className)}>
            {shortcuts.map((shortcut, i) => (
                <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="text-label text-content-muted">or</span>}
                    <span className={shortcutStyle}>{renderShortcut(shortcut)}</span>
                </span>
            ))}
        </span>
    )
}
