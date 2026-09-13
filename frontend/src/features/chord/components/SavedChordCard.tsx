import { shapeToDiagram } from "@/application/diagram/shapeToDiagram";
import { Shape } from "../../../domain/geometry/Shape";
import { ChordDiagram } from "@/features/chord/components/ChordDiagram";
import { ChordWrapper } from "@/features/chord/components/ChordWrapper";
import { buildDiagramLayout } from "@/rendering/buildDiagramLayout";
import type { ApiSavedChordResponse } from "@/types/api"

interface SavedChordCardProps {
    chord: ApiSavedChordResponse;
}

function formatVoicing(voicing: { frets: (number | null)[] }) {
    return voicing.frets;
}

export const SavedChordCard = ({ chord }: SavedChordCardProps) => {
    const chordShape = new Shape(formatVoicing(chord.voicing as { frets: (number | null)[] }));
    const diagram = shapeToDiagram(chordShape);
    const diagramLayout = { ...buildDiagramLayout(diagram), voicing: chordShape.getFrets() };

    return (
        <span className="flex flex-col items-center gap-2 p-2 w-full h-full bg-white rounded-2xl border border-stroke-subtle">
            <ChordWrapper className="scale w-full h-full [&_svg]:w-full [&_svg]:h-full">
                <ChordDiagram diagram={diagramLayout} />
            </ChordWrapper>
            <time
                className="text-xs text-content-muted"
                dateTime={chord.dateSaved}
            >
                Saved on {new Date(chord.dateSaved).toLocaleDateString()}
            </time>
            
        </span>
    )
}
