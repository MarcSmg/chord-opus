import type { RenderedDiagram } from "../../../rendering/buildDiagramLayout";
import { ChordSearchHeader } from "./ChordSearchHeader";
import { ChordSearchResults } from "./ChordSearchResults";

interface ChordSearchPanelProps {
    input: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    svgs: RenderedDiagram[];
    notFound: boolean;
}

export const ChordSearchPanel = ({ input, onInputChange, onClear, svgs, notFound }: ChordSearchPanelProps) => (
    <>
        <ChordSearchHeader
            input={input}
            onInputChange={onInputChange}
            onClear={onClear}
            hasResults={svgs.length > 0}
        />
        <ChordSearchResults svgs={svgs} notFound={notFound} />
    </>
);
