import { MobileContext } from "@/context/MobileContext"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import type { ReactNode } from "react"

export const MobileProvider = ({ children }: { children: ReactNode }) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <MobileContext.Provider value={{ isMobile: !isDesktop }}>
            {children}
        </MobileContext.Provider>
    )
}
