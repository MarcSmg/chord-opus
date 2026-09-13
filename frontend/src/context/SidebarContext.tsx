import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

interface SidebarContextType {
    isSidebarExtended: boolean;
    setSidebarExtended: Dispatch<SetStateAction<boolean>>;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) 
        throw new Error("useSidebar must be used inside a SidebarProvider")
    return context;
}