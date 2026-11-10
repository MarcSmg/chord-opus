import { Shape } from "@/domain/geometry/Shape";
import { shapeToDiagram } from "@/application/diagram/shapeToDiagram";
import { buildDiagramLayout, type RenderedDiagram } from "@/rendering/buildDiagramLayout";
import type { ApiSavedChordResponse } from "@/types/api";

// `voicing` is a freeform JSONField on the backend — nothing guarantees it
// still matches the shape the frontend currently saves, so a row written
// under an older/different format shouldn't crash the whole saved-chords
// grid.
function isValidVoicing(voicing: unknown): voicing is { frets: (number | null)[] } {
    return (
        typeof voicing === "object" &&
        voicing !== null &&
        Array.isArray((voicing as { frets?: unknown }).frets)
    );
}

export function savedChordToDiagram(chord: ApiSavedChordResponse): RenderedDiagram | null {
    if (!isValidVoicing(chord.voicing)) return null;

    const shape = new Shape(chord.voicing.frets);
    const diagram = shapeToDiagram(shape);
    return { ...buildDiagramLayout(diagram, chord.symbol), voicing: shape.getFrets() };
}
