import { useEffect, useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    Xmark,
    Play,
    Minus,
    Plus,
    Bookmark,
    BookmarkSolid,
    ViewGrid,
    Download,
    ShareAndroid,
    Album,
} from "iconoir-react";
import { Shape } from "@/domain/geometry/Shape";
import { shapeToDiagram } from "@/application/diagram/shapeToDiagram";
import { buildDiagramLayout, type RenderedDiagram } from "@/rendering/buildDiagramLayout";
import { formatChordName } from "@/application/notation/formatChordName";
import { ChordDiagram } from "./ChordDiagram";
import { ChordWrapper } from "./ChordWrapper";
import { DownloadDialog } from "./DownloadDialog";
import { Tooltip } from "@/shared/ui/Tooltip";
import { chordApi } from "@/api/chords";
import { useSavedChords } from "@/context/SavedChordsContext";
import { useChordDetail } from "@/context/ChordDetailContext";
import { useMobile } from "@/context/MobileContext";
import { Button } from "@/shared/ui/Button";

type SaveStatus = "idle" | "saving" | "saved" | "error";
type PanelState = "extended" | "collapsed";

// Spring config for smooth panel transitions
const PANEL_SPRING = { type: "spring", stiffness: 320, damping: 30, mass: 0.9 } as const;
const CONTENT_FADE = { duration: 0.15 };

// Dimensions
const TOOLBAR_WIDTH = 224;
const TOOLBAR_HEIGHT = 48;
const PANEL_WIDTH = 320; // max-w-sm = 384px, but we use 320 for the panel content
const PANEL_BORDER_RADIUS = 16; // rounded-2xl = 1rem = 16px, shared by both states

interface ChordDetailPanelProps {
    active?: boolean;
}

export const ChordDetailPanel = ({ active = true }: ChordDetailPanelProps) => {
    const { diagram: selectedDiagram, closeChordDetail } = useChordDetail();
    const diagram = active ? selectedDiagram : null;
    const { isMobile } = useMobile();
    const reduceMotion = useReducedMotion();
    const [shape, setShape] = useState<Shape | null>(null);
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [panelState, setPanelState] = useState<PanelState>("extended");
    const { markChordSaved, isChordSaved } = useSavedChords();

    // Reset to the incoming voicing every time a different chord is opened
    useEffect(() => {
        setShape(diagram?.voicing ? new Shape(diagram.voicing) : null);
    }, [diagram]);

    // Escape key to close
    useEffect(() => {
        if (!diagram) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeChordDetail();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [diagram, closeChordDetail]);

    const liveDiagram: RenderedDiagram | null = useMemo(() => {
        if (!shape) return null;
        return { ...buildDiagramLayout(shapeToDiagram(shape)), voicing: shape.getFrets() };
    }, [shape]);

    const frets = shape?.getFrets();
    const symbol = shape ? formatChordName(shape.getFrets()) : null;
    const isSaved = frets ? isChordSaved(frets) : false;

    const handleTranspose = (amount: number) => {
        if (!shape) return;
        try {
            setShape(shape.transpose(amount));
        } catch {
            // Already at the lowest fret
        }
    };

    const handleSave = async () => {
        if (!symbol || !frets || saveStatus === "saving") return;
        setSaveStatus("saving");
        try {
            await chordApi.saveChord({ symbol, voicing: { frets } });
            markChordSaved(frets);
            setSaveStatus("saved");
        } catch {
            setSaveStatus("error");
        } finally {
            setTimeout(() => setSaveStatus("idle"), 1500);
        }
    };

    const bookmarkIcon = saveStatus === "saved" || isSaved
        ? <BookmarkSolid className="size-4 text-primary" strokeWidth={2} />
        : saveStatus === "error"
            ? <Bookmark className="size-4 text-status-error" strokeWidth={2} />
            : <Bookmark className="size-4" strokeWidth={2} />;

    const toolbarButtonClass = "flex size-9 shrink-0 items-center justify-center rounded-xl text-content transition-colors cursor-pointer hover:bg-ui-elevated hover:text-primary disabled:cursor-not-allowed disabled:text-content-disabled disabled:hover:bg-transparent disabled:hover:text-content-disabled";
    // Separate from toolbarButtonClass rather than overridden via cn(): two
    // `size-*` utilities on the same element don't reliably collapse to the
    // later one — Tailwind's generated order decides, not class-string order.
    const compactToolbarButtonClass = "flex size-8 shrink-0 items-center justify-center rounded-lg text-content-muted transition-colors cursor-pointer hover:bg-ui-elevated hover:text-primary disabled:cursor-not-allowed disabled:text-content-disabled disabled:hover:bg-transparent disabled:hover:text-content-disabled";

    const ToolbarDivider = () => <span className="mx-1 w-px shrink-0 bg-stroke-subtle" />;
    const CompactDivider = () => <span className="mx-0.5 h-5 w-px shrink-0 bg-stroke-subtle" />;

    // The panel content that cross-fades
    const PanelContent = () => (
        <div className="flex flex-col items-center gap-1 overflow-hidden px-1 pb-1">
            {liveDiagram && (
                <ChordWrapper frets={frets} className="aspect-square w-full max-w-full [&_svg]:h-full [&_svg]:w-full">
                    <ChordDiagram diagram={liveDiagram} />
                </ChordWrapper>
            )}
            <div className="flex flex-wrap items-center justify-center gap-1 w-full rounded-xl bg-ui-card/80 p-1.5">
                <Tooltip label="Transpose down">
                    <button type="button" onClick={() => handleTranspose(-1)} className={toolbarButtonClass}>
                        <Minus width={16} height={16} strokeWidth={2} />
                    </button>
                </Tooltip>
                <Tooltip label="Transpose up">
                    <button type="button" onClick={() => handleTranspose(1)} className={toolbarButtonClass}>
                        <Plus width={16} height={16} strokeWidth={2} />
                    </button>
                </Tooltip>
                <ToolbarDivider />
                <Tooltip label="Play chord — coming soon">
                    <button type="button" disabled className={toolbarButtonClass}>
                        <Play width={16} height={16} strokeWidth={2} />
                    </button>
                </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-2 w-full bg-ui-card/60">
                <Button onClick={() => setIsDownloadOpen(true)} icon={<Download />} variant="primary">Download</Button>
                <div className="flex">
                    <Tooltip label="Save">
                        <button type="button" onClick={handleSave} className={toolbarButtonClass}>
                            {bookmarkIcon}
                        </button>
                    </Tooltip>
                    <Tooltip label="See on fretboard — coming soon">
                        <button type="button" disabled className={toolbarButtonClass}>
                            <ViewGrid width={16} height={16} strokeWidth={2} />
                        </button>
                    </Tooltip>
                    <Tooltip label="Share — coming soon">
                        <button type="button" disabled className={toolbarButtonClass}>
                            <ShareAndroid width={16} height={16} strokeWidth={2} />
                        </button>
                    </Tooltip>
                </div>
            </div>
        </div>
    );

    // The collapsed state's content: a compact toolbar rather than a bare
    // circle. Same card ⇄ collapsed principle as before — transpose is left
    // out here since it only makes sense once the diagram itself is visible.
    const ToolbarContent = () => (
        <div className="flex h-full w-full items-center justify-between gap-0.5 px-1.5">
            <div className="w-10"></div>
            <div className="flex h-full w-full items-center justify-between gap-0.5 px-1.5">
                <Tooltip label="Play chord — coming soon">
                    <button type="button" disabled className={compactToolbarButtonClass}>
                        <Play width={14} height={14} strokeWidth={2} />
                    </button>
                </Tooltip>
                <Tooltip label="See on fretboard — coming soon">
                    <button type="button" disabled className={compactToolbarButtonClass}>
                        <ViewGrid width={14} height={14} strokeWidth={2} />
                    </button>
                </Tooltip>
                <Tooltip label="Save">
                    <button type="button" onClick={handleSave} className={compactToolbarButtonClass}>
                        {bookmarkIcon}
                    </button>
                </Tooltip>
                <Tooltip label="Share — coming soon">
                    <button type="button" disabled className={compactToolbarButtonClass}>
                        <ShareAndroid width={14} height={14} strokeWidth={2} />
                    </button>
                </Tooltip>
                <CompactDivider />
            </div>
            <Tooltip label="Expand">
                <button
                    type="button"
                    onClick={() => setPanelState("extended")}
                    className="rounded-full p-1 transition-colors hover:bg-ui-elevated hover:text-content" aria-label="Extend chord detail panel"
                >
                    <Plus width={16} height={16} strokeWidth={2} />
                </button>
            </Tooltip>
        </div>
    );

    // Header with collapse/close buttons
    const Header = () => (
        <div className="flex justify-end gap-2 z-10 p-1">
            {isMobile ?
                <></> :
                <button
                    type="button"
                    onClick={() => setPanelState((s) => (s === "extended" ? "collapsed" : "extended"))}
                    className={cn(
                        "rounded-full p-1 transition-colors hover:bg-ui-elevated hover:text-primary",
                        panelState === "collapsed" && "w-2 h-2"
                    )}
                    aria-label={panelState === "extended" ? "Collapse panel" : "Extend panel"}
                >
                    {panelState === "extended" ? (
                        <Minus width={16} height={16} strokeWidth={2} />
                    ) : (
                        <Plus width={16} height={16} strokeWidth={2} />
                    )}
                </button>
            }
            <button
                type="button"
                onClick={closeChordDetail}
                className="rounded-full p-1 transition-colors hover:bg-ui-elevated hover:text-content"
            >
                <Xmark width={16} height={16} strokeWidth={2} />
                <span className="sr-only">Close</span>
            </button>
        </div>
    );

    if (!diagram) return null;

    const isExtended = panelState === "extended";

    // Compute layout based on state
    const layout = isExtended
        ? { width: PANEL_WIDTH, height: "auto", borderRadius: PANEL_BORDER_RADIUS }
        : { width: TOOLBAR_WIDTH, height: TOOLBAR_HEIGHT, borderRadius: PANEL_BORDER_RADIUS };

    return (
        <>
            <AnimatePresence>
                {isMobile ? (
                    // Mobile: full-screen drawer from right
                    <>
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)" }}
                            animate={{ backdropFilter: "blur(4px)" }}
                            exit={{ backdropFilter: "blur(0px)" }}
                            transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
                            className="fixed inset-0 z-90"
                            onClick={closeChordDetail}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
                                className="absolute inset-0 bg-black"
                            />
                        </motion.div>

                        {/* <motion.aside
                            role="dialog"
                            aria-label={symbol ? `${symbol} chord details` : "Chord details"}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 380, damping: 38 }}
                            className="fixed right-0 top-0 z-100 h-full w-full max-w-sm flex-col overflow-hidden"
                            style={{ width: isExtended ? "100%" : TOOLBAR_WIDTH + 16 }} // +16 for padding
                        > */}
                        <motion.div
                            layoutId="panel"
                            layout
                            // drag={!reduceMotion}
                            // dragMomentum={false}
                            // dragElastic={0.1}
                            // whileDrag={{ cursor: "grabbing" }}
                            transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
                            style={{
                                position: "absolute",
                                inset: 0,
                                placeSelf: "center",
                                ...layout,
                            }}
                            className={cn(
                                "flex flex-col z-100 overflow-hidden border-l border-stroke-subtle shadow-detail-md cursor-grab touch-none",
                                isExtended ? "bg-ui-card" : "bg-ui-card/80 backdrop-blur-lg"
                            )}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={CONTENT_FADE}
                                    className="flex-1 flex flex-col"
                                >
                                    <Header />
                                    <PanelContent />
                                </motion.div>

                            </AnimatePresence>
                        </motion.div>
                        {/* </motion.aside> */}
                    </>
                ) : (
                    // Desktop: inline panel that transforms
                    <motion.aside
                        role="dialog"
                        aria-label={symbol ? `${symbol} chord details` : "Chord details"}
                        initial={false}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-0 top-0 z-100"
                    >
                        <motion.div
                            layoutId="panel"
                            layout
                            drag={!reduceMotion}
                            dragMomentum={false}
                            dragElastic={0.1}
                            whileDrag={{ cursor: "grabbing" }}
                            transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                ...layout,
                            }}
                            // No rounded-* class here: border-radius is animated between
                            // states via the inline style below (part of `layout`), and an
                            // inline style always wins over a class — a rounded-* class here
                            // would be dead weight, never visibly applied.
                            className={cn(
                                "flex flex-col overflow-hidden border border-stroke-subtle shadow-detail-md cursor-grab touch-none",
                                isExtended ? "bg-ui-card" : "bg-ui-card/80 backdrop-blur-lg"
                            )}
                        >
                            <AnimatePresence mode="popLayout" initial={false}>
                                {isExtended ? (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={CONTENT_FADE}
                                        className="flex-1 flex flex-col"
                                    >
                                        <Header />
                                        <PanelContent />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="circle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={CONTENT_FADE}
                                        className="flex h-full w-full items-center justify-center"
                                    >
                                        <ToolbarContent />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>

            <DownloadDialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen} diagram={liveDiagram} />
        </>
    );
};
