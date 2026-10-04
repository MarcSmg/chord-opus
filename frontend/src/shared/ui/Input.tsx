import { useEffect, useRef, type ComponentPropsWithRef, type ReactNode } from "react"
import { Xmark } from "iconoir-react"
import { ShortcutHint } from "./ShortcutHint"
import { cn } from "@/shared/utils/cn"

interface InputProps extends ComponentPropsWithRef<"input"> {
    icon?: ReactNode;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear?: () => void;
    shortcut?: boolean;
}

export const Input = ({
    placeholder,
    type,
    className,
    icon,
    value,
    onClear,
    shortcut = false,
    ...props

}: InputProps) => {

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!shortcut) return;

        const handleShortcut = (e: KeyboardEvent) => {
            const isModifierPressed = e.ctrlKey || e.metaKey;
            const isSlashPressed = e.key === "/";
            const isCtrlKPressed = isModifierPressed && e.key.toLowerCase() === "k";

            const activeElement = document.activeElement?.tagName;

            if (activeElement?.toLocaleLowerCase() === "input" || activeElement?.toLocaleLowerCase() === "textarea")
                return;

            if (isSlashPressed || isCtrlKPressed) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        }

        window.addEventListener('keydown', handleShortcut);

        return () => window.removeEventListener('keydown', handleShortcut)
    }, [shortcut]);

    return (
        <div
            className="relative flex items-center"
        >
            {icon}
            <input
                ref={inputRef}
                type={type}
                placeholder={placeholder}
                value={value}
                className={cn(className, "outline-0 outline-stroke-subtle/60 focus:outline-3 transition-all duration-100")}
                {...props}
            />

            <span className="absolute right-5 flex items-center gap-2">
                {shortcut && <ShortcutHint shortcuts={["mod+k", "/"]} />}

                {onClear && (
                    <span
                        className={cn(value ? "flex" : "hidden", "p-1 rounded-full bg-stroke-subtle cursor-pointer hover:bg-accent-secondary-soft active:bg-stroke-strong/80 duration-200")}
                        onClick={onClear}
                    >
                        <Xmark width={15} height={15} strokeWidth={2} />
                    </span>
                )}
            </span>
        </div>

    )
}
