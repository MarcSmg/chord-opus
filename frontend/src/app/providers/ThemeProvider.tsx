import { useLayoutEffect, useState, type ReactNode } from "react";
import { ThemeContext, type Theme } from "../../context/ThemeContext";

const THEME_STORAGE_KEY = "theme";

const isTheme = (value: string | null): value is Theme =>
    value === "light" || value === "dark" || value === "system";

const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

export const ThemeProvider = ({children}: {children: ReactNode}) => {

    const [theme, setTheme] = useState<Theme>(() => {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);
        return isTheme(saved) ? saved : "system";
    })

    // useLayoutEffect (not useEffect) so the class toggle lands synchronously
    // inside the flushSync callback ThemeSwitcher wraps its setTheme call in —
    // the View Transition snapshot needs the new class applied before it
    // captures the "after" frame, and plain passive effects run too late for that.
    useLayoutEffect(() => {
        const root = window.document.documentElement;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

        const applyTheme = () => {
            const resolvedTheme = theme === "system" ? getSystemTheme() : theme;
            root.classList.toggle("dark", resolvedTheme === "dark");
        };

        applyTheme();
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        if (theme !== "system") return;

        mediaQuery.addEventListener("change", applyTheme);
        return () => mediaQuery.removeEventListener("change", applyTheme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
