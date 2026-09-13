import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeProviderType {
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
}

export const ThemeContext = createContext<ThemeProviderType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context)
        throw new Error('useTheme must be used within a ThemeProvider');
    return context;
}
