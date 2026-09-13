import { createContext, useContext } from "react";

export interface SavedChordsContextType {
    isChordSaved: (frets: readonly (number | null)[]) => boolean;
    markChordSaved: (frets: readonly (number | null)[]) => void;
    isLoading: boolean;
}

export const SavedChordsContext = createContext<SavedChordsContextType | undefined>(undefined);

export const useSavedChords = () => {
    const context = useContext(SavedChordsContext);
    if (!context)
        throw new Error("useSavedChords must be used inside a SavedChordsProvider");
    return context;
}
