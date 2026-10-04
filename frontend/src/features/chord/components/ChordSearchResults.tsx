import { useState } from "react"
import type { RenderedDiagram as ChordDiagramLayout } from "../../../rendering/buildDiagramLayout"
import { ChordDiagram } from "./ChordDiagram"
import { ChordMenu } from "./ChordMenu"
import { ChordWrapper } from "./ChordWrapper"
import { useChordDetail } from "@/context/ChordDetailContext"
import { cn } from "@/shared/utils/cn"

interface SearchResultsProps extends React.ComponentPropsWithoutRef<"div"> {
    svgs: ChordDiagramLayout[];
    notFound: boolean;
}

export const ChordSearchResults = ({ svgs, notFound, ...props }: SearchResultsProps) => {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const { openChordDetail } = useChordDetail();

    const handleRightClick = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        // if (e.button !== 2) return; // Ensure it's a right-click
        setOpenMenuId(prev => (prev === id ? null : id));
    }

    return (
        <div
            className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-3 gap-y-2 place-items-center w-full h-full transition-all ease-out md:gap-y-4 max-sm:grid-cols-2"
            {...props}
        >
            {notFound ? (
                <p>Not found</p>
            ) : (
                svgs.map((svg, i) => (
                    <span className="flex flex-col gap-2 w-full h-full"
                        key={i}
                    >
                        <ChordWrapper
                            className={cn(
                                "scale w-full h-full [&_svg]:w-full [&_svg]:h-full cursor-pointer rounded-2xl border border-stroke-subtle transition duration-500 ease-out",
                                openMenuId === i && "border-0 z-70 scale-105 -rotate-z-3"
                            )}
                            onClick={() => openChordDetail(svg)}
                            onContextMenu={(e) => handleRightClick(e, i)}
                            frets={svg.voicing}
                            >
                            <ChordDiagram diagram={svg} />
                        </ChordWrapper>
                        <ChordMenu
                            isActive={openMenuId === i}
                            onOpen={() => setOpenMenuId(i)}
                            onClose={() => setOpenMenuId(null)}
                            className="self-end mr-2"
                            diagram={svg}
                            symbol={svg.label}
                            frets={svg.voicing}
                        />
                    </span>
                ))
            )}
        </div>
    )
}
