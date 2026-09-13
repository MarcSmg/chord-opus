import { createInterval } from "../../domain/harmony/Interval";
import { Chord } from "../../domain/harmony/Chord";
import { isQualityAlias, QUALITY_ALIASES, QUALITY_PATTERNS } from "./chordQualities";
import { isNote, NOTE_MAP } from "./notemap";
import { PitchClass } from "../../domain/harmony/PitchClass";

export const ROOT_TOKEN_PATTERN = /^([A-Ga-g](?:#|b)?)(.*)$/;

function parseChordSymbol(raw: string) {

    const match = raw.match(ROOT_TOKEN_PATTERN); // returns the root note and the rest

    if (!match) {
        throw new Error(`Invalid chord symbol: ${raw}`);
    }

    const [, rootToken, qualityToken] = match;

    if (!isNote(rootToken)) {
        throw new Error(`Unknown root: ${rootToken}`);
    }
    
    const rootSemitone = NOTE_MAP[rootToken];

    if (!isQualityAlias(qualityToken)) {
        throw new Error(`Unknown chord quality: ${qualityToken}`);
    }

    const canonical = QUALITY_ALIASES[qualityToken];
    const semitones = QUALITY_PATTERNS[canonical];

    return {
        value: Chord.create(
            PitchClass.create(rootSemitone),
            semitones.map(createInterval)
        ),
        symbol: raw
    };
}

export {parseChordSymbol};