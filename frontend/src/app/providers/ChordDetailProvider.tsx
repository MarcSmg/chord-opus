import { useState, type ReactNode } from "react";
import { ChordDetailContext } from "@/context/ChordDetailContext";
import type { RenderedDiagram } from "@/rendering/buildDiagramLayout";

export const ChordDetailProvider = ({ children }: { children: ReactNode }) => {
    const [diagram, setDiagram] = useState<RenderedDiagram | null>(null);

    return (
        <ChordDetailContext.Provider
            value={{
                diagram,
                openChordDetail: setDiagram,
                closeChordDetail: () => setDiagram(null),
            }}
        >
            {children}
        </ChordDetailContext.Provider>
    );
};
