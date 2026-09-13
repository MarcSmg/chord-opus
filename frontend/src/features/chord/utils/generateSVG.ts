import { shapeToDiagram } from "../../../application/diagram/shapeToDiagram";
import { parseChordSymbol } from "../../../application/notation/parseChordSymbol";
import { findChordShapes } from "../../../application/solver/generation/findChordShapes";
import type { Fretboard } from "../../../domain/geometry/Fretboard";
import { buildDiagramLayout, type RenderedDiagram } from "../../../rendering/buildDiagramLayout";

function generateSVG(input: string, fretboard: Fretboard): RenderedDiagram[] {
    const {value: chord,} = parseChordSymbol(input);

    const shapes = findChordShapes(chord, fretboard);

    const diagrams = shapes.map(shape => {
      const diagram = shapeToDiagram(shape);
      return { ...buildDiagramLayout(diagram, input), voicing: shape.getFrets() };
    });

    // console.log(diagrams)

    return diagrams;
}

export default generateSVG;