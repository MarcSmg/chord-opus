import { AnimatePresence, motion } from "motion/react"
import { memo, useState, type ComponentPropsWithRef } from "react";
import { Bookmark, BookmarkSolid, MoreHoriz, Download, ShareAndroid } from "iconoir-react"
import { Tooltip } from "@/shared/ui/Tooltip";
import { cn } from "@/shared/utils/cn";
import { DownloadDialog } from "./DownloadDialog";
import { chordApi } from "../../../api/chords";
import { useSavedChords } from "@/context/SavedChordsContext";

const menuButtonClass = "flex items-center justify-center size-8 rounded-full text-content-muted hover:bg-ui-elevated hover:text-primary transition-colors cursor-pointer";

interface ChordMenuProps extends ComponentPropsWithRef<"div"> {
    isActive: boolean;
    onOpen: () => void;
    onClose: () => void;
    svg: SVGSVGElement | null;
    symbol?: string;
    frets?: readonly (number | null)[];
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

export const ChordMenu = memo(({ isActive, onOpen, onClose, svg, symbol, frets, className }: ChordMenuProps) => {
    const [isDownloadOpen, setIsDownloadOpen] = useState(false);
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const { markChordSaved } = useSavedChords();

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

    const bookmarkIcon = saveStatus === "saved"
        ? <BookmarkSolid className="size-4 text-status-success" strokeWidth={2} />
        : saveStatus === "error"
            ? <Bookmark className="size-4 text-status-error" strokeWidth={2} />
            : <Bookmark className="size-4" strokeWidth={2} />;

    return (
        <div className={cn(className, "relative flex flex-col justify-center items-center w-fit rounded-lg hover:bg-ui-surface")} >
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation(); // Stop click from triggering row actions
                    isActive ? onClose() : onOpen();
                }}
                className={cn(
                    "p-1 rounded-md transition-colors cursor-pointer",
                    isActive ? "text-primary bg-ui-elevated" : "text-content-muted hover:text-content"
                )}
            >
                <MoreHoriz className="size-5 text-content" strokeWidth={3}/>
            </button>

            <AnimatePresence>
                {isActive && (
                    <>
                        <motion.div
                            initial={{ backdropFilter: "blur(0px)" }}
                            animate={{ backdropFilter: "blur(8px)" }}
                            exit={{ backdropFilter: "blur(0px)" }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed inset-0 z-60"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                        >
                            {/* Chrome doesn't render backdrop-filter on a layer whose own
                                opacity is being animated, so the fade lives on this inner
                                layer instead of the blurred one. */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                                className="absolute inset-0 bg-black"
                            />
                        </motion.div>

                        <motion.div
                            initial={{ width: 40, opacity: 0 }}
                            animate={{ width: "auto", opacity: 1 }}
                            exit={{ width: 40, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 350, damping: 22, mass: 0.6 }}
                            className="absolute -left-10 -translate-x-1/2 -top-90 z-100 flex flex-row items-center gap-1 p-1 rounded-full bg-ui-surface shadow-detail-md border border-stroke-strong/50 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Tooltip label="Save" placement="top">
                                <motion.button
                                    type="button"
                                    onClick={handleSave}
                                    whileHover={{ y: -3 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    className={menuButtonClass}
                                >
                                    {bookmarkIcon}
                                </motion.button>
                            </Tooltip>
                            <Tooltip label="Download" placement="top">
                                <motion.button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        setIsDownloadOpen(true);
                                    }}
                                    whileHover={{ y: -3 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    className={menuButtonClass}
                                >
                                    <Download className="size-4" strokeWidth={2} />
                                </motion.button>
                            </Tooltip>
                            <Tooltip label="Share" placement="top">
                                <motion.button
                                    type="button"
                                    whileHover={{ y: -3 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    className={menuButtonClass}
                                >
                                    <ShareAndroid className="size-4" strokeWidth={2} />
                                </motion.button>
                            </Tooltip>
                        </motion.div>
                    </>
                )}

            </AnimatePresence>

            <DownloadDialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen} svg={svg} />
        </div>
    )
}, (prev, next) => {
    return prev.isActive === next.isActive && prev.svg === next.svg
        && prev.symbol === next.symbol && prev.frets === next.frets;
});
