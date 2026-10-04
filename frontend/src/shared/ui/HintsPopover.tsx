import { useEffect, useState } from "react";
import { Button } from "./Button";
import { ShortcutHint, type Shortcut } from "./ShortcutHint";
import { cn } from "@/shared/utils/cn";
import Heading from "./Heading";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from "./Popover";

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
        <Popover open={isOpen} onOpenChange={setIsOpen} className={className}>
            <PopoverTrigger>
                <Button className="rounded-lg bg-accent-secondary-soft">
                    Hints
                    <ShortcutHint shortcuts={["shift+h"]} />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-max min-w-56 p-2">
                <PopoverHeader>
                    <Heading level={5} className="mb-0">Hints</Heading>
                </PopoverHeader>
                <ul className="flex flex-col gap-1">
                    {hints.map((hint) => (
                        <li key={hint.label} className={cn("flex items-center justify-between gap-6 border-t border-stroke-subtle px-3 py-1.5")}>
                            <span className="text-label text-content">{hint.label}</span>
                            <ShortcutHint shortcuts={hint.shortcuts} />
                        </li>
                    ))}
                </ul>
            </PopoverContent>
        </Popover>
    );
};
