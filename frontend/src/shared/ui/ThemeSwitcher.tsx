import { Computer, HalfMoon, SunLight } from "iconoir-react";
import { motion } from "motion/react";
import { flushSync } from "react-dom";
import { useTheme, type Theme } from "../../context/ThemeContext";
import { cn } from "@/shared/utils/cn";

const themes = [
    { key: "system", icon: Computer, label: "Use system theme" },
    { key: "light", icon: SunLight, label: "Use light theme" },
    { key: "dark", icon: HalfMoon, label: "Use dark theme" },
] as const;

const SWIPE_DURATION = 700;

// A left-to-right wipe reveal for the theme change, built on the View
// Transitions API: the browser snapshots the before/after states, and this
// animates the "new" snapshot's clip-path from fully hidden (clipped from
// the right edge all the way in, via a percentage inset so it doesn't need
// to read the viewport size) to fully shown, in place of the browser's
// default cross-fade.
function swipeRight() {
    document.documentElement.animate(
        {
            clipPath: [
                "inset(0 100% 0 0)",
                "inset(0 0 0 0)",
            ],
        },
        {
            duration: SWIPE_DURATION,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
        }
    );
}

/** Selects the colour theme used across the application. */
export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const handleSelect = (key: Theme) => {
        if (key === theme) return;

        if (!document.startViewTransition) {
            setTheme(key);
            return;
        }

        const transition = document.startViewTransition(() => {
            flushSync(() => setTheme(key));
        });

        transition.ready.then(swipeRight);
    };

    return (
        <div
            aria-label="Theme preference"
            className="relative flex h-full items-center rounded-full border border-stroke-subtle bg-ui-card p-1 shadow-detail-sm"
            role="group"
        >
            {themes.map(({ key, icon: Icon, label }) => {
                const isActive = theme === key;

                return (
                    <button
                        aria-label={label}
                        aria-pressed={isActive}
                        className="relative grid size-7 place-items-center cursor-pointer rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-ui-surface"
                        key={key}
                        onClick={() => handleSelect(key)}
                        type="button"
                    >
                        {isActive && (
                            <motion.span
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 rounded-full bg-accent-soft"
                                initial={{ opacity: 0, scale: 0.88 }}
                                layoutId="active-theme"
                                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                            />
                        )}
                        <Icon
                            aria-hidden="true"
                            className={cn("relative size-4", isActive ? "text-primary" : "text-content-muted")}
                            strokeWidth={2}
                        />
                    </button>
                );
            })}
        </div>
    );
};
