import { useEffect, useMemo, useRef, useState, type ComponentPropsWithRef } from "react"
import { AnimatePresence, motion } from "motion/react"
import { InputSearch, Xmark } from "iconoir-react"
import { ShortcutHint } from "@/shared/ui/ShortcutHint";
import { getChordSuggestions } from "@/application/notation/getChordSuggestions";
import { cn } from "@/shared/utils/cn";

interface InputProps extends ComponentPropsWithRef<"input"> {
    hasText: boolean,
    onClear: () => void
}


export const ChordSearchInput = ({ id, className = "", hasText, onClear, ...props }: InputProps) => {

    const shortcuts = ["mod+k", "/"]
    const inputRef = useRef<HTMLInputElement>(null);
    const value = typeof props.value === "string" ? props.value : "";
    const typedLength = value.trim().length;

    const suggestions = useMemo(() => getChordSuggestions(value), [value]);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [suggestions.join(",")]);

    const showSuggestions = isOpen && suggestions.length > 0;

    const selectSuggestion = (suggestion: string) => {
        props.onChange?.({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>);
        setIsOpen(false);
        inputRef.current?.focus();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions) return;

        if (e.key === "ArrowDown" ) {
            e.preventDefault();
            setActiveIndex((i) => (i + 1) % suggestions.length);
        } else if (e.key === "ArrowUp" ) {
            e.preventDefault();
            setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            selectSuggestion(suggestions[activeIndex]);
        } else if (e.key === "Escape") {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        inputRef.current?.focus();
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
    }, []);

    return (
        <div
            className={cn("flex relative items-center", className)}
        >
            <span className="absolute left-5">
                <InputSearch className="text-accent-secondary" />
            </span>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search a chord... (Eg: Cm)"
                className="w-full pl-15 px-5 py-2 font-heading font-medium border-2 border-stroke-strong rounded-2xl outline-0 outline-accent-secondary/50 shadow-md focus:outline-3 focus:bg-ui-card transition-all duration-100"
                role="combobox"
                aria-expanded={showSuggestions}
                aria-controls="chord-suggestion-list"
                aria-autocomplete="list"
                autoComplete="off"
                {...props}
                onFocus={(e) => { setIsOpen(true); props.onFocus?.(e); }}
                onBlur={(e) => { setIsOpen(false); props.onBlur?.(e); }}
                onChange={(e) => { setIsOpen(true); props.onChange?.(e); }}
                onKeyDown={(e) => { handleKeyDown(e); props.onKeyDown?.(e); }}
            />
            <span className="absolute right-5 flex gap-2 items-center transition-all">
                <ShortcutHint shortcuts={shortcuts}/>

                <span
                    className={cn(hasText ? "flex" : "hidden", "p-1 rounded-full bg-stroke-subtle cursor-pointer hover:bg-accent-secondary-soft active:bg-stroke-strong/80 duration-200")}
                    onClick={onClear}
                >
                    <Xmark width={15} height={15} strokeWidth={2} />
                </span>
            </span>

            <AnimatePresence>
                {showSuggestions && (
                    <motion.ul
                        id="chord-suggestion-list"
                        role="listbox"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 700, damping: 30 }}
                        style={{ transformOrigin: "top" }}
                        className="absolute grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2 top-full left-0 right-0 mt-2 p-2 z-20 bg-ui-card/50 backdrop-blur-lg border-2 border-stroke-strong/60 rounded-2xl shadow-md overflow-hidden"
                    >
                        {suggestions.map((suggestion, i) => (
                            <li
                                key={suggestion}
                                id={`chord-suggestion-${i}`}
                                role="option"
                                aria-selected={i === activeIndex}
                                onMouseDown={(e) => e.preventDefault()}
                                onMouseEnter={() => setActiveIndex(i)}
                                onClick={() => selectSuggestion(suggestion)}
                                className={cn(
                                    "flex px-5 py-2 font-heading font-medium justify-center text-label rounded-xl cursor-pointer transition-all duration-400 outline-0 border border-accent-bold/50",
                                    i === activeIndex && "bg-accent-bold/40"
                                )}
                            >
                                <span className="text-content">{suggestion.slice(0, typedLength)}</span>
                                <span className="text-accent-secondary">{suggestion.slice(typedLength)}</span>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}
