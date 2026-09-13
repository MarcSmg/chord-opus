import { createContext, useContext } from "react";

interface MobileContextType {
    isMobile: boolean;
}

export const MobileContext = createContext<MobileContextType | undefined>(undefined);

export const useMobile = () => {
    const context = useContext(MobileContext);
    if (!context)
        throw new Error("useMobile must be used inside a MobileProvider")
    return context;
}
