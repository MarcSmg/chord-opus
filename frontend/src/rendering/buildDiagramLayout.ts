import type { Diagram, Dot } from "../application/diagram/shapeToDiagram";

type Constraints = {
    margin: number,
    stringSpacing: number,
    fretSpacing: number,
    width: number,
    height: number,
    originX: number,
    originY: number,
    stringCount: number,
    fretCount: number,
    topOffset: number,
    nutHeight: number
}

export type RenderedDiagram = {
    strings: StringData[],
    frets: FretData[],
    dots: DotData[],
    openStrings: DotData[]
    mutedStrings: DotData[],
    baseFret?: number,
    constraints: Constraints,
    label?: string,
    voicing?: readonly (number | null)[]
}

export type StringData = {x: number};
export type FretData = {y: number, isNut: boolean};
export type DotData = {x: number, y: number};

function createConstraints(diagram: Diagram): Constraints {
    const stringCount = diagram.stringCount
    const fretCount = 5;

    const topOffset = diagram.mutedStrings.length !== 0 || diagram.openStrings.length !== 0 ? 40 : 25;
    const leftOffset = diagram.baseFret > 1 ? 20 : 0;

    const margin = 25;
    const stringSpacing = 25; // horizontal gap
    const fretSpacing = 45; // vertical gap

    const originX = margin + leftOffset;
    const originY = margin + topOffset;
    const nutHeight = 6;

    return {
        margin,
        stringSpacing,
        fretSpacing,
        width: originX + (stringCount - 1) * stringSpacing + margin,
        height: margin * 2 + topOffset + fretCount * fretSpacing,
        originX,
        originY,
        stringCount,
        fretCount,
        topOffset,
        nutHeight
    };
}

function buildDiagramLayout(diagram: Diagram, label?: string): RenderedDiagram {

    const constraints = createConstraints(diagram);

    const baseFret = diagram.baseFret;

    const strings = listStrings(constraints);
    const frets = listFrets(constraints, baseFret);
    const dots = listDots(constraints, diagram);
    const openStrings = listOpenStrings(constraints, diagram);
    const mutedStrings = listMutedStrings(constraints, diagram);

    return {
        strings,
        frets,
        dots,
        openStrings,
        mutedStrings,
        baseFret,
        constraints,
        label
    }

}

function listStrings(c: Constraints): StringData[] {

    let strings: StringData[] = [];

    for (let i = 0; i < c.stringCount; i++) {

        const x = c.originX + i * c.stringSpacing;

        strings.push({x});
    }

    return strings;
}

function listFrets(c: Constraints, baseFret: number): FretData[] {

    let frets: FretData[] = [];

    const originY = c.originY;
    
    const isNut = baseFret > 1 ? false : true;

    frets.push({
        y: originY,
        isNut
    })

    for (let i = 1; i <= c.fretCount; i++ ) {
        const y = originY + i * c.fretSpacing;

        frets.push({y, isNut: false});
    }

    return frets;
}

function listDots(c: Constraints, diagram: Diagram): DotData[] {
    const dots = diagram.dots.map((dot: Dot) => {
        return {
            x: c.originX + dot.stringIndex * c.stringSpacing,
            y: c.originY + (dot.fret - 1) * c.fretSpacing + c.fretSpacing / 2,

        };
    })
    return dots;
}

function listOpenStrings(c: Constraints, diagram: Diagram): DotData[] {
    const markerY = c.originY - 0.4 * c.fretSpacing;
    const openStrings = diagram.openStrings.map((stringIndex: number) => {
        return {
            x: c.originX + stringIndex * c.stringSpacing,
            y: markerY
        }
    })
    return openStrings;
}

function listMutedStrings(c: Constraints, diagram: Diagram): DotData[] {
    const markerY = c.originY - 0.4 * c.fretSpacing;
    const mutedStrings = diagram.mutedStrings.map((stringIndex: number) => {
        return {
            x: c.originX + stringIndex * c.stringSpacing,
            y: markerY,
        }
    })
    return mutedStrings;
}

// function drawChordName(c: Constraints, label: string): string {
//     const centerX = c.originX + ((c.stringCount - 1) * c.stringSpacing) / 2;
//     const y = c.originY - c.topOffset - 5;

//     return text(centerX, y, label);
// }

export {buildDiagramLayout as buildDiagramLayout};