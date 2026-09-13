import { Fragment } from "react/jsx-runtime";
import type { RenderedDiagram } from "../../../rendering/buildDiagramLayout"
import { forwardRef } from "react";
import { formatChordName } from "../../../application/notation/formatChordName";

type ChordDiagramProps = {
    diagram: RenderedDiagram,
    width?: number,
    height?: number,
    onContextMenu?: (e: React.MouseEvent) => void
}

export const ChordDiagram = forwardRef<SVGSVGElement, ChordDiagramProps>(({diagram, width=diagram.constraints.width, height=diagram.constraints.height, onContextMenu}: ChordDiagramProps, ref) => {

    const c = diagram.constraints;
    const chordName = diagram.voicing ? formatChordName(diagram.voicing) : null;
    const centerX = c.originX + ((c.stringCount - 1) * c.stringSpacing) / 2;

  return (
    <svg onContextMenu={onContextMenu} ref={ref} viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        <rect width="100%" height="100%" fill="white"/>
        {chordName && (
            <text
                x={centerX}
                y={c.margin}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-heading font-medium text-chord-symbol fill-black"
            >
                {chordName}
            </text>
        )}
        {
            diagram.strings.map((s, i) => (
                <line key={i} x1={s.x} x2={s.x} y1={c.originY} y2={c.originY + c.fretCount * c.fretSpacing} stroke="black"/>
            ))
        }

        {
            diagram.frets.map((f, i) => {
                
                return (<Fragment key={i}>
                        <line x1={c.originX} x2={ c.originX + (c.stringCount - 1) * c.stringSpacing} y1={f.y} y2={f.y} stroke="black" strokeWidth={f.isNut ? 5 : 2}/>
                        {(diagram.baseFret !== 1) && <text x={c.originX - c.stringSpacing - 15} y={c.originY + c.fretSpacing / 2} >{diagram.baseFret} fr</text>}
                    </Fragment>
                 )
                })
            }
            {diagram.baseFret ? 1 : 0}

        {
            diagram.dots.map((d, i) =>(
                <circle key={i} cx={d.x} cy={d.y} r={5} fill="black" />
            ))
        }

        {
            diagram.openStrings.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={4} stroke="black" strokeWidth={2} fill="none" />
            ))
        }

        {
            diagram.mutedStrings.map((ms, i) => (
                <text key={i} x={ms.x} y={ms.y} fontSize="18" fontWeight="500" textAnchor="middle" dominantBaseline="middle">x</text>
            ))
        }
    </svg> 
  )
}
)