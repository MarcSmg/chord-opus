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
    PlaylistPlus,
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
import Heading from "@/shared/ui/Heading";
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
const CIRCLE_SIZE = 48; // 15px * 3 = 45px, rounded to 48 for better touch target
const PANEL_WIDTH = 320; // max-w-sm = 384px, but we use 320 for the panel content
const PANEL_BORDER_RADIUS = 28; // rounded-2xl = 1rem = 16px, but we use 28 for smoother transition

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

    const ToolbarDivider = () => <span className="mx-1 h-6 w-px shrink-0 bg-stroke-subtle" />;

    // The panel content that cross-fades
    const PanelContent = () => (
        <div className="flex flex-col items-center gap-2 overflow-hidden p-4">
            {liveDiagram && (
                <ChordWrapper frets={frets} className="aspect-square w-full max-w-full [&_svg]:h-full [&_svg]:w-full">
                    <ChordDiagram diagram={liveDiagram} />
                </ChordWrapper>
            )}
            {symbol && <Heading level={3} className="mt-2 mb-0 font-medium">{symbol}</Heading>}
            <div className="flex flex-wrap items-center justify-center gap-1 w-full rounded-xl bg-ui-card/80 p-1.5 shadow-detail-sm">
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
                <Tooltip label="See on fretboard — coming soon">
                    <button type="button" disabled className={toolbarButtonClass}>
                        <ViewGrid width={16} height={16} strokeWidth={2} />
                    </button>
                </Tooltip>
                <Tooltip label="Save">
                    <button type="button" onClick={handleSave} className={toolbarButtonClass}>
                        {bookmarkIcon}
                    </button>
                </Tooltip>
                <Tooltip label="Share — coming soon">
                    <button type="button" disabled className={toolbarButtonClass}>
                        <ShareAndroid width={16} height={16} strokeWidth={2} />
                    </button>
                </Tooltip>
            </div>
            <div className="flex justify-between items-center gap-2 w-full p-2 bg-ui-card/60">
                <Button onClick={() => setIsDownloadOpen(true)} icon={<Download />} variant="primary"></Button>
                <Button icon={<Album />} variant="secondary"></Button>
            </div>
        </div>
    );

    // The circle button content
    const CircleContent = () => (
        <button
            type="button"
            className="flex h-full w-full items-center justify-center rounded-full bg-ui-card/80 backdrop-blur-lg border border-stroke-subtle cursor-pointer"
            aria-label="Extend chord detail panel"
            onClick={() => setPanelState("extended")}
        >
            <Plus width={20} height={20} strokeWidth={2} />
        </button>
    );

    // Header with collapse/close buttons
    const Header = () => (
        <div className="absolute left-4 top-4 flex items-center gap-2 z-10">
            <button
                type="button"
                onClick={() => setPanelState((s) => (s === "extended" ? "collapsed" : "extended"))}
                className={cn(
                    "rounded-full p-1.5 transition-colors hover:bg-ui-elevated hover:text-primary",
                    panelState === "collapsed" && "w-6 h-6"
                )}
                aria-label={panelState === "extended" ? "Collapse panel" : "Extend panel"}
            >
                {panelState === "extended" ? (
                    <Minus width={16} height={16} strokeWidth={2} />
                ) : (
                    <Plus width={16} height={16} strokeWidth={2} />
                )}
            </button>
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

    // Background diagram + frosted glass
    const Background = () => (
        <>
            {liveDiagram && (
                <ChordWrapper frets={frets} className="absolute inset-0 -z-20 h-full w-full [&_svg]:h-full [&_svg]:w-full">
                    <ChordDiagram diagram={liveDiagram} />
                </ChordWrapper>
            )}
            <div className="absolute inset-0 -z-10 bg-accent-secondary-soft/40 backdrop-blur-lg" />
        </>
    );

    if (!diagram) return null;

    const isExtended = panelState === "extended";

    // Compute layout based on state
    const layout = isExtended
        ? { width: PANEL_WIDTH, height: "auto", borderRadius: PANEL_BORDER_RADIUS }
        : { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: "50%" };

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

                        <motion.aside
                            role="dialog"
                            aria-label={symbol ? `${symbol} chord details` : "Chord details"}
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 380, damping: 38 }}
                            className="fixed right-0 top-0 z-100 h-full w-full max-w-sm flex-col overflow-hidden"
                            style={{ width: isExtended ? "100%" : CIRCLE_SIZE + 16 }} // +16 for padding
                        >
                            <Background />
                            <motion.div
                                layoutId="panel"
                                layout
                                transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    top: 0,
                                    ...layout,
                                }}
                                className={cn(
                                    "flex flex-col overflow-hidden border-l border-stroke-subtle shadow-detail-md",
                                    isExtended ? "bg-ui-card" : "bg-ui-card/80 backdrop-blur-lg"
                                )}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {isExtended ? (
                                        <motion.div
                                            key="content"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={CONTENT_FADE}
                                            className="flex-1 flex flex-col pt-12"
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
                                            className="flex h-full w-full items-center justify-center p-2"
                                        >
                                            <CircleContent />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </motion.aside>
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
                        <Background />
                        <motion.div
                            layoutId="panel"
                            layout
                            transition={reduceMotion ? { duration: 0 } : PANEL_SPRING}
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                ...layout,
                            }}
                            className={cn(
                                "flex flex-col overflow-hidden rounded-lg border border-stroke-subtle shadow-detail-md",
                                isExtended ? "bg-ui-card" : "bg-ui-card/80 backdrop-blur-lg"
                            )}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isExtended ? (
                                    <motion.div
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={CONTENT_FADE}
                                        className="flex-1 flex flex-col pt-12"
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
                                        className="flex h-full w-full items-center justify-center p-2"
                                    >
                                        <CircleContent />
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
