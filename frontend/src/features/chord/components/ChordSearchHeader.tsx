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
    { label: "Navigate results", shortcuts: ["↑", "↓"] },
    { label: "Select result", shortcuts: ["Enter"] },
    { label: "Close suggestions", shortcuts: ["Esc"] },
];

export const ChordSearchHeader = ({ input, onInputChange, onClear, hasResults }: ChordSearchHeaderProps) => {
    const {isTouchDevice} = useDevice();
    return (
        <section className="relative flex flex-col items-center mb-10">
            {!isTouchDevice && (
                <HintsPopover hints={searchHints} className="absolute right-5" />
            )}
            <div className=" w-full md:w-[60%] xl:w-[40%]">
                <ChordSearchInput
                    type="text"
                    value={input}
                    onChange={onInputChange}
                    hasText={!!input}
                    onClear={onClear}
                    className="rounded-full mb-2"
                />
                {hasResults && (
                    <div>
                        <Button className="rounded-full" variant="primary">Chord Family</Button>
                    </div>
                )}
            </div>
        </section>
    )
}
