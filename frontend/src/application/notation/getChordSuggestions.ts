import { isNote, NOTE_MAP } from "./notemap";
import { QUALITY_ALIASES } from "./chordQualities";
import { ROOT_TOKEN_PATTERN } from "./parseChordSymbol";

const ROOT_NOTES = Object.keys(NOTE_MAP);
const QUALITY_ALIAS_KEYS = Object.keys(QUALITY_ALIASES);

/**
 * Suggests chord symbols that continue what the user has typed so far, e.g.
 * "C" -> ["C", "Cm", "C7", "Cmaj7", ...] or "Cm" -> ["Cm", "Cm7", "Cm9", ...].
 *
 * Quality completions are offered as soon as a root is typed, even if that
 * root could still be extended into a sharp/flat (e.g. "C" could become
 * "C#") — the user can keep typing the accidental themselves if they want it.
 */
export function getChordSuggestions(input: string, limit = 8): string[] {
    const trimmed = input.trim();
    if (!trimmed) return [];

    const match = trimmed.match(ROOT_TOKEN_PATTERN);
    if (!match) return [];

    const [, rootToken, qualityToken] = match;
    const rootPrefix = rootToken.charAt(0).toUpperCase() + rootToken.slice(1);

    const matchingRoots = ROOT_NOTES.filter((note) => note.startsWith(rootPrefix));
    if (matchingRoots.length === 0) return [];

    const root = isNote(rootPrefix) ? rootPrefix : matchingRoots[0];
    const matchingQualities = QUALITY_ALIAS_KEYS
        .filter((quality) => quality.startsWith(qualityToken))
        .sort((a, b) => a.length - b.length || a.localeCompare(b));

    return matchingQualities.slice(0, limit).map((quality) => `${root}${quality}`);
}
