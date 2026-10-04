import { useRef, type ReactNode } from "react";
import { HardDrive, JpgFormat, PngFormat, SvgFormat } from "iconoir-react";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/Dialog";
import { downloadJPG, downloadMIDI, downloadPNG, downloadSVG } from "../utils/downloadChordDiagram";
import { ChordDiagram } from "./ChordDiagram";
import { ChordWrapper } from "./ChordWrapper";
import type { RenderedDiagram } from "@/rendering/buildDiagramLayout";

interface DownloadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diagram: RenderedDiagram | null;
}

interface DownloadOption {
    label: string;
    icon: ReactNode;
    download: (svg: SVGSVGElement | null) => void;
    disabled?: boolean;
}

const downloadOptions: DownloadOption[] = [
    { label: "SVG", icon: <SvgFormat width={22} height={22} strokeWidth={2} />, download: downloadSVG },
    { label: "PNG", icon: <PngFormat width={22} height={22} strokeWidth={2} />, download: downloadPNG },
    { label: "JPG", icon: <JpgFormat width={22} height={22} strokeWidth={2} />, download: downloadJPG },
    { label: "MIDI", icon: <HardDrive width={22} height={22} strokeWidth={2} />, download: () => downloadMIDI(), disabled: true },
];

export const DownloadDialog = ({ open, onOpenChange, diagram }: DownloadDialogProps) => {
    const svgRef = useRef<SVGSVGElement>(null);

    const handleSelect = (option: DownloadOption) => {
        if (option.disabled) return;

        option.download(svgRef.current);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Download chord</DialogTitle>
                    <DialogDescription>Choose a format to download this chord diagram.</DialogDescription>
                    {diagram && (
                        <ChordWrapper className="mt-2 aspect-square max-w-full border-2 border-stroke-subtle rounded-2xl self-center [&_svg]:h-full [&_svg]:w-full">
                            <ChordDiagram ref={svgRef} diagram={diagram} />
                        </ChordWrapper>
                    )}
                </DialogHeader>

                <DialogBody>
                    <div className="grid grid-cols-4 gap-3">
                        {downloadOptions.map((option) => (
                            <button
                                key={option.label}
                                type="button"
                                disabled={option.disabled}
                                onClick={() => handleSelect(option)}
                                className="flex aspect-square flex-col items-center justify-center p-2 gap-1 cursor-pointer rounded-xl border border-stroke-subtle bg-ui-surface text-label font-medium text-content transition-colors hover:border-accent-secondary hover:text-accent-secondary disabled:cursor-not-allowed disabled:border-stroke-subtle disabled:bg-ui-elevated disabled:text-content-disabled disabled:hover:border-stroke-subtle disabled:hover:text-content-disabled"
                            >
                                {option.icon}
                                {option.label}
                                {option.disabled && <span className="text-label text-content-disabled">Soon</span>}
                            </button>
                        ))}
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
};