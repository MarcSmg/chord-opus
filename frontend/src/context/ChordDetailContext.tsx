import { createContext, useContext } from "react";
import type { RenderedDiagram } from "@/rendering/buildDiagramLayout";

export interface ChordDetailContextType {
    diagram: RenderedDiagram | null;
    openChordDetail: (diagram: RenderedDiagram) => void;
    closeChordDetail: () => void;
}

export const ChordDetailContext = createContext<ChordDetailContextType | undefined>(undefined);

export const useChordDetail = () => {
    const context = useContext(ChordDetailContext);
    if (!context)
        throw new Error("useChordDetail must be used inside a ChordDetailProvider");
    return context;
};
