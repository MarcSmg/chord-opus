import { useEffect, useMemo, useState, type ReactNode } from "react"
import { SavedChordsContext } from "@/context/SavedChordsContext"
import { chordApi } from "@/api/chords"

// Canonical string key for a voicing — used as a Set entry so "is this exact
// shape already saved" is an O(1) lookup instead of scanning + deep-comparing
// every saved chord on every card render. `null`/`undefined` (muted string)
// both normalize to "x" so the key only depends on the actual fret numbers.
function getVoicingSignature(frets: readonly (number | null)[]): string {
    return frets.map(f => (f === null || f === undefined ? "x" : f)).join(",");
}

// Provides an app-wide, O(1) "is this chord shape already saved?" check.
// Fetches the user's saved chords once (on mount) and keeps only a Set of
// voicing signatures in state — not the full chord objects — since that's
// all any consumer actually needs to answer the question.
export const SavedChordsProvider = ({ children }: { children: ReactNode }) => {
    const [signatures, setSignatures] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Guards against setting state after the provider has unmounted
        // (e.g. the request resolves after the user has already logged out).
        let isMounted = true;

        const loadSavedChords = async () => {
            try {
                const chords = await chordApi.getAllSavedChords();

                if (isMounted) {
                    const next = new Set<string>();
                    for (const chord of chords) {
                        const voicing = chord.voicing as { frets?: (number | null)[] } | null | undefined;
                        if (voicing?.frets) {
                            next.add(getVoicingSignature(voicing.frets));
                        }
                    }
                    setSignatures(next);
                }
            } catch {
                // Not fatal — the "already saved" marker just won't show until reload.
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadSavedChords();

        return () => {
            isMounted = false;
        };
    }, []);

    // Memoized so consumers reading this context don't re-render on every
    // provider render — only when the signature set (or loading state) actually changes.
    const value = useMemo(() => ({
        isChordSaved: (frets: readonly (number | null)[]) => signatures.has(getVoicingSignature(frets)),
        // Lets callers (e.g. after a successful save) flip the marker on
        // immediately, without waiting for a refetch of the whole list.
        markChordSaved: (frets: readonly (number | null)[]) => {
            setSignatures(prev => {
                const next = new Set(prev);
                next.add(getVoicingSignature(frets));
                return next;
            });
        },
        isLoading,
    }), [signatures, isLoading]);

    return (
        <SavedChordsContext.Provider value={value}>
            {children}
        </SavedChordsContext.Provider>
    )
}
