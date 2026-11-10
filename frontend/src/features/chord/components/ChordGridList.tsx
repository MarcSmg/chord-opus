import { useState } from "react"
import type { RenderedDiagram as ChordDiagramLayout, RenderedDiagram } from "../../../rendering/buildDiagramLayout"
import { ChordDiagram } from "./ChordDiagram"
import { ChordMenu } from "./ChordMenu"
import { ChordWrapper } from "./ChordWrapper"
import { useChordDetail } from "@/context/ChordDetailContext"
import { cn } from "@/shared/utils/cn"
import { AnimatePresence, motion } from "motion/react"

interface SearchResultsProps extends React.ComponentPropsWithoutRef<"div"> {
    svgs: ChordDiagramLayout[];
    notFound: boolean;
}

export const ChordGridList = ({ svgs, notFound, ...props }: SearchResultsProps) => {

    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [activeChordId, setActiveChordId] = useState<number | null>(null);
    const { openChordDetail } = useChordDetail();

    const handleRightClick = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        // if (e.button !== 2) return; // Ensure it's a right-click
        setOpenMenuId(prev => (prev === id ? null : id));
    }

    const handleOpenChordDetail = (id: number, svg: RenderedDiagram) => {
        openMenuId !== id && openChordDetail(svg)
    }

    const handleMouseOver = (e: React.MouseEvent, id: number) => {
        openMenuId !== id && setActiveChordId(id);
    }

    const handleOpenMenu = (id: number) => {
        setActiveChordId(null);
        setOpenMenuId(id);
    }

    const handleCloseMenu = () => setOpenMenuId(null);

    return (
        <div
            className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-x-5 gap-y-2 place-items-center w-full h-full transition-all ease-out md:gap-y-4 max-sm:grid-cols-2"
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
                                "relative scale w-full h-full [&_svg]:w-full [&_svg]:h-full cursor-pointer rounded-2xl border border-stroke-subtle transition duration-500 ease-out",
                                openMenuId === i && "border-0 z-70 scale-105 -rotate-z-3"
                            )}
                            onClick={() => handleOpenChordDetail(i, svg)}
                            onMouseOver={(e) => handleMouseOver(e, i)}
                            onMouseOut={() => setActiveChordId(null)}
                            onContextMenu={(e) => handleRightClick(e, i)}
                            frets={svg.voicing}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    className="absolute -inset-4 rounded-2xl pointer-events-none"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={activeChordId === i ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.2, damping: 50, stiffness: 500 }}
                                >
                                    <div className="absolute inset-0 bg-accent-secondary-soft rounded-2xl" />
                                </motion.div>
                            </AnimatePresence>
                            <div
                                className={cn(
                                    "relative bg-white scale w-full h-full [&_svg]:w-full [&_svg]:h-full cursor-pointer rounded-2xl border border-stroke-subtle transition duration-500 ease-out",
                                )}
                            >
                                <ChordDiagram bgOpacity={0} diagram={svg} />
                            </div>
                        </ChordWrapper>
                        <ChordMenu
                            isActive={openMenuId === i}
                            onOpen={() => handleOpenMenu(i)}
                            onClose={() => handleCloseMenu()}
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
