import type { ComponentPropsWithRef } from "react"
import { BookmarkSolid } from "iconoir-react"
import { useSavedChords } from "@/context/SavedChordsContext"
import { cn } from "@/shared/utils/cn"

interface ChordWrapperProps extends ComponentPropsWithRef<"div"> {
    frets?: readonly (number | null)[];
}
export const ChordWrapper = ({ children, className, frets, ...props }: ChordWrapperProps) => {
    const { isChordSaved } = useSavedChords();
    const isSaved = frets ? isChordSaved(frets) : false;

    return (
        <div
            {...props}
            className={cn("relative", className)} >
            <div
                className="flex justify-center items-center h-full w-full bg-white rounded-2xl overflow-hidden select-none"
            >
                {children}
            </div>

            {isSaved && (
                <span className="absolute top-2 right-2 flex items-center justify-center rounded-full bg-primary p-1 text-white shadow-detail-sm">
                    <BookmarkSolid width={12} height={12} strokeWidth={2} />
                </span>
            )}
        </div>
    )
}
