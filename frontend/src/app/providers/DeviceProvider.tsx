import { DeviceContext } from "@/context/DeviceContext"
import { useMediaQuery } from "@/shared/hooks/useMediaQuery"
import type { ReactNode } from "react"

// `(pointer: coarse)` is the standard way to detect a touch-primary input
// (phones, tablets) — unlike viewport width, it isn't fooled by a narrow
// desktop window, and unlike user-agent sniffing, it isn't spoofable/reduced
// by the browser.
export const DeviceProvider = ({ children }: { children: ReactNode }) => {
    const isTouchDevice = useMediaQuery("(pointer: coarse)");

    return (
        <DeviceContext.Provider value={{ isTouchDevice }}>
            {children}
        </DeviceContext.Provider>
    )
}
