import { ChordSearchInput } from "./ChordSearchInput"
import { HintsPopover } from "@/shared/ui/HintsPopover"
import { Button } from "@/shared/ui/Button"
import { useDevice } from "@/context/DeviceContext"

interface ChordSearchHeaderProps {
    input: string,
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onClear: () => void,
    hasResults: boolean
}

const searchHints = [
    { label: "Focus search", shortcuts: ["mod+k", "/"] },
    { label: "Navigate results", shortcuts: ["←", "→"] },
    { label: "Select result", shortcuts: ["Enter"] },
    { label: "Close suggestions", shortcuts: ["Esc"] },
    { label: "Chord Options", shortcuts: ["Right Click"] },
    { label: "Open chord details panel", shortcuts: ["Left Click"] },
    { label: "Close chord details panel", shortcuts: ["Esc"] },
];

export const ChordSearchHeader = ({ input, onInputChange, onClear, hasResults }: ChordSearchHeaderProps) => {
    const { isTouchDevice } = useDevice();
    return (
        <section className="relative flex flex-col items-center mb-10">
            <div className="flex md:grid md:grid-cols-[1fr_1.5fr_1fr] gap-2 w-full">
                <div className="flex-1 md:col-start-2">
                    <ChordSearchInput
                        type="text"
                        value={input}
                        onChange={onInputChange}
                        hasText={!!input}
                        onClear={onClear}
                        className="flex-1 rounded-full min-w-100 max-w-180 mb-2"
                    />
                    {hasResults && (
                        <div className="flex-1 md:col-start-2">
                            <Button variant="primary">Chord Family</Button>
                        </div>
                    )}
                </div>
                {!isTouchDevice && (
                    <HintsPopover hints={searchHints} className="ml-auto mt-1" />
                )}
            </div>
        </section>
    )
}
