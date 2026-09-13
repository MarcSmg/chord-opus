import { SidebarContext } from "@/context/SidebarContext"
import { useState, type ReactNode } from "react"

export const SidebarProvider = ({children}: {children: ReactNode}) => {

    const [isExtended, setIsExtended] = useState(false);

    return (
        <SidebarContext.Provider value = {{isSidebarExtended: isExtended, setSidebarExtended: setIsExtended}}>
            {children}
        </SidebarContext.Provider>
    )
}
