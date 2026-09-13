import { createContext, useContext } from "react";

interface DeviceContextType {
    isTouchDevice: boolean;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDevice = () => {
    const context = useContext(DeviceContext);
    if (!context)
        throw new Error("useDevice must be used inside a DeviceProvider")
    return context;
}
