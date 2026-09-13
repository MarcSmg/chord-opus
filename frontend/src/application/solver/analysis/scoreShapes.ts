import { Fretboard } from "../../../domain/geometry/Fretboard";
import { Shape } from "../../../domain/geometry/Shape";
import type { Chord } from "../../../domain/harmony/Chord";
import { hasRootInBass } from "./bassNoteAnalysis";
import { barrePotential, fingerSpread, hasIsolatedNote } from "./playability";

export function scoreShapes(shapes: Shape[], chord: Chord, fretboard: Fretboard): Shape[] {

    return shapes
        .map(s => {

            s.score = 0;

            const playedFrets = s.played();
            const duplicatesCount = playedFrets.length - new Set(playedFrets).size;

            s.score += 
                - s.baseFret() * 0.5
                - s.span() * 1.5
                - s.mutedStringsCount() * 0.5
                - fingerSpread(s) * 0.2;
                - duplicatesCount * 0.2
                + s.openStringsCount() * 0.5
                + s.cagedSimilarity() * 3.5;
                + barrePotential(s) * 0.5;

            if (hasIsolatedNote(s)) s.score -= 2;
            if (hasRootInBass(s, chord, fretboard)) {
                s.score += 2;
            } else {
                s.score -= 1;
            }

            return s;
        })
        .sort((a, b) => b.score - a.score);
}

