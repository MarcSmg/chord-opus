import { Fretboard } from "../../domain/geometry/Fretboard";
import { Shape } from "../../domain/geometry/Shape";
import type { PitchClass } from "../../domain/harmony/PitchClass";
import { extractShapePitchClasses } from "../solver/analysis/extractShapePitchClasses";
import { getBassPitchClass } from "../solver/analysis/bassNoteAnalysis";
import { QUALITY_PATTERNS } from "./chordQualities";

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// One preferred display suffix per quality — the reverse of chordQualities'
// many-aliases-to-one-canonical mapping ("maj"/"" both parse to "major", but
// only one of them should come back out). Symbols follow the brand
// guidelines' notation (e.g. "°" for diminished, "ø" for m7b5).
const QUALITY_SYMBOLS: Record<keyof typeof QUALITY_PATTERNS, string> = {
    major: "",
    minor: "m",
    major7: "maj7",
    minor7: "m7",
    dominant7: "7",
    diminished: "°",
    augmented: "aug",
    maj9: "maj9",
    m9: "m9",
    m7b5: "ø",
    dim7: "°7",
    add9: "add9",
    minadd9: "madd9",
    maj7sharp11: "maj7#11",
    maj11: "maj11",
    min11: "m11",

    // Core 7th chords
    minMaj7: "m(maj7)",
    maj7sharp5: "maj7#5",
    dom7sharp5: "7#5",

    // Major chord extensions
    maj13: "maj13",
    maj9sharp11: "maj9#11",
    maj13sharp11: "maj13#11",

    // Dominant chord extensions & alterations
    dominant9: "9",
    dominant11: "11",
    dominant13: "13",
    dom7flat5: "7b5",
    dom7flat9: "7b9",
    dom7sharp9: "7#9",
    dom7sharp11: "7#11",
    dom7flat13: "7b13",
    dom9sharp11: "9#11",
    dom13sharp11: "13#11",
    dom7alt: "7alt",
    dom7flat9flat13: "7(b9,b13)",
    dom7flat9sharp11: "7(b9,#11)",
    dom7sharp9flat13: "7(#9,b13)",
    dom7sharp9sharp11: "7(#9,#11)",
    dom7flat5flat9: "7(b5,b9)",
    dom7flat5sharp9: "7(b5,#9)",
    dom7sharp5flat9: "7(#5,b9)",
    dom7sharp5sharp9: "7(#5,#9)",

    // Minor chord extensions
    m13: "m13",
    m6: "m6",
    "m6/9": "m6/9",

    // Minor-major chord extensions
    mMaj9: "m(maj9)",
    mMaj11: "m(maj11)",
    mMaj13: "m(maj13)",

    // Half-diminished chord extensions
    m11flat5: "m11(b5)",
    m9flat5: "m9(b5)",
};

function noteName(pc: PitchClass): string {
    return NOTE_NAMES[pc.toNumber()];
}

function intervalFrom(root: PitchClass, pc: PitchClass): number {
    return ((pc.toNumber() - root.toNumber()) % 12 + 12) % 12;
}

// Tries `root` against every known quality: do the other notes, expressed as
// intervals from this root, exactly match one of the quality templates?
function matchQuality(root: PitchClass, pitchClasses: PitchClass[]): string | null {
    const intervals = new Set(pitchClasses.map((pc) => intervalFrom(root, pc)));

    for (const [quality, pattern] of Object.entries(QUALITY_PATTERNS)) {
        const patternSet = new Set<number>(pattern);
        const isExactMatch = patternSet.size === intervals.size
            && [...patternSet].every((interval) => intervals.has(interval));

        if (isExactMatch) {
            return QUALITY_SYMBOLS[quality as keyof typeof QUALITY_PATTERNS];
        }
    }

    return null;
}

/**
 * Reverse-computes a chord symbol from the notes a shape actually plays,
 * rather than trusting whatever string the user originally searched — so a
 * shape built any other way (e.g. reconstructed from a saved voicing) still
 * gets a correct, independent name.
 *
 * Root selection just tries the bass note first: voicings/inversions aren't
 * modeled yet, so there's no distinct symbol for e.g. C vs A/C — every shape
 * gets read as if its lowest played note were the root.
 */
export function formatChordName(frets: readonly (number | null)[]): string | null {
    const fretboard = new Fretboard(21);
    const shape = new Shape(frets);
    const pitchClasses = extractShapePitchClasses(shape, fretboard);

    if (pitchClasses.length === 0) return null;

    const bass = getBassPitchClass(shape, fretboard);
    const candidates = bass
        ? [bass, ...pitchClasses.filter((pc) => !pc.equals(bass))]
        : pitchClasses;

    for (const root of candidates) {
        const symbol = matchQuality(root, pitchClasses);
        if (symbol !== null) {
            return `${noteName(root)}${symbol}`;
        }
    }

    return null;
}
