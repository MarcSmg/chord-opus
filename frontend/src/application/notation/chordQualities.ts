const QUALITY_PATTERNS = {
    major:      [0, 4, 7],
    minor:      [0, 3, 7],
    major7:     [0, 4, 7, 11],
    minor7:     [0, 3, 7, 10],
    dominant7:  [0, 4, 7, 10],
    diminished: [0, 3, 6],
    augmented:  [0, 4, 8],

    maj9:       [0, 4, 7, 11, 2],
    m9:         [0, 3, 7, 10, 2],
    m7b5:       [0, 3, 6, 10],
    dim7:       [0, 3, 6, 9],
    add9:       [0, 4, 7, 2],
    minadd9:    [0, 3, 7, 2],
    maj7sharp11:[0, 4, 7, 11, 6], // #11 = +6 semitones
    maj11:      [0, 4, 7, 11, 5],
    min11:      [0, 3, 7, 10, 2, 5], // includes the 9th, as a full m11 chord does

    // Core 7th chords
    minMaj7:      [0, 3, 7, 11],     // m(maj7) — minor triad + major 7th
    maj7sharp5:   [0, 4, 8, 11],     // augmented triad + major 7th
    dom7sharp5:   [0, 4, 8, 10],     // augmented triad + b7 (also "7#5" below)

    // Major chord extensions
    maj13:        [0, 4, 7, 11, 2, 9],
    maj9sharp11:  [0, 4, 7, 11, 2, 6],
    maj13sharp11: [0, 4, 7, 11, 2, 6, 9],

    // Dominant chord extensions & alterations
    dominant9:    [0, 4, 7, 10, 2],
    dominant11:   [0, 4, 7, 10, 2, 5],
    dominant13:   [0, 4, 7, 10, 2, 5, 9],
    dom7flat5:    [0, 4, 6, 10],
    dom7flat9:    [0, 4, 7, 10, 1],
    dom7sharp9:   [0, 4, 7, 10, 3],
    dom7sharp11:  [0, 4, 7, 10, 6],
    dom7flat13:   [0, 4, 7, 10, 8],
    dom9sharp11:  [0, 4, 7, 10, 2, 6],
    dom13sharp11: [0, 4, 7, 10, 2, 6, 9],
    // Altered dominant ("altered scale" chord): root, 3, b7 + every alteration,
    // no natural 5/9/11/13 — alterations replace them.
    dom7alt:           [0, 4, 10, 1, 3, 6, 8],
    dom7flat9flat13:   [0, 4, 10, 1, 8],       // b13 replaces the natural 5
    dom7flat9sharp11:  [0, 4, 7, 10, 1, 6],    // #11 coexists with the natural 5
    dom7sharp9flat13:  [0, 4, 10, 3, 8],
    dom7sharp9sharp11: [0, 4, 7, 10, 3, 6],
    dom7flat5flat9:    [0, 4, 6, 10, 1],       // b5 replaces the natural 5
    dom7flat5sharp9:   [0, 4, 6, 10, 3],
    dom7sharp5flat9:   [0, 4, 8, 10, 1],       // #5 replaces the natural 5
    dom7sharp5sharp9:  [0, 4, 8, 10, 3],

    // Minor chord extensions
    m13:   [0, 3, 7, 10, 2, 5, 9],
    m6:    [0, 3, 7, 9],
    "m6/9": [0, 3, 7, 9, 2],

    // Minor-major chord extensions
    mMaj9:  [0, 3, 7, 11, 2],
    mMaj11: [0, 3, 7, 11, 2, 5],
    mMaj13: [0, 3, 7, 11, 2, 5, 9],

    // Half-diminished chord extensions
    m11flat5: [0, 3, 6, 10, 2, 5],
    m9flat5:  [0, 3, 6, 10, 2],
} as const;

const QUALITY_ALIASES = {
    "":        "major",
    "maj":     "major",
    "m":       "minor",
    "min":     "minor",

    "7":       "dominant7",
    "maj7":    "major7",
    "M7":      "major7",
    "m7":      "minor7",
    "min7":    "minor7",

    "dim":     "diminished",
    "°":       "diminished",
    "aug":     "augmented",

    "maj9":    "maj9",
    "M9":      "maj9",

    "m9":      "m9",
    "min9":    "m9",

    "m7b5":    "m7b5",
    "ø":       "m7b5",

    "dim7":    "dim7",
    "°7":      "dim7",

    "add9":    "add9",
    "minadd9": "minadd9",
    "madd9":   "minadd9",

    "maj7#11": "maj7sharp11",
    "M7#11":   "maj7sharp11",

    "maj11":   "maj11",
    "M11":     "maj11",

    "m11":     "min11",
    "min11":   "min11",

    // Core 7th chords
    "m(maj7)":  "minMaj7",
    "mmaj7":    "minMaj7",
    "maj7#5":   "maj7sharp5",
    "M7#5":     "maj7sharp5",
    "7#5":      "dom7sharp5",

    // Major chord extensions
    "maj13":    "maj13",
    "M13":      "maj13",
    "maj9#11":  "maj9sharp11",
    "M9#11":    "maj9sharp11",
    "maj13#11": "maj13sharp11",
    "M13#11":   "maj13sharp11",

    // Dominant chord extensions & alterations
    "9":              "dominant9",
    "11":             "dominant11",
    "13":             "dominant13",
    "7b5":            "dom7flat5",
    "7b9":            "dom7flat9",
    "7#9":            "dom7sharp9",
    "7#11":           "dom7sharp11",
    "7b13":           "dom7flat13",
    "9#11":           "dom9sharp11",
    "13#11":          "dom13sharp11",
    "7alt":           "dom7alt",
    "alt7":           "dom7alt",
    "7(b9,b13)":      "dom7flat9flat13",
    "7b9b13":         "dom7flat9flat13",
    "7(b9,#11)":      "dom7flat9sharp11",
    "7b9#11":         "dom7flat9sharp11",
    "7(#9,b13)":      "dom7sharp9flat13",
    "7#9b13":         "dom7sharp9flat13",
    "7(#9,#11)":      "dom7sharp9sharp11",
    "7#9#11":         "dom7sharp9sharp11",
    "7(b5,b9)":       "dom7flat5flat9",
    "7b5b9":          "dom7flat5flat9",
    "7(b5,#9)":       "dom7flat5sharp9",
    "7b5#9":          "dom7flat5sharp9",
    "7(#5,b9)":       "dom7sharp5flat9",
    "7#5b9":          "dom7sharp5flat9",
    "7(#5,#9)":       "dom7sharp5sharp9",
    "7#5#9":          "dom7sharp5sharp9",

    // Minor chord extensions
    "m13":  "m13",
    "min13":"m13",
    "m6":   "m6",
    "min6": "m6",
    "m6/9":  "m6/9",
    "min6/9":"m6/9",

    // Minor-major chord extensions
    "m(maj9)":  "mMaj9",
    "mmaj9":    "mMaj9",
    "m(maj11)": "mMaj11",
    "mmaj11":   "mMaj11",
    "m(maj13)": "mMaj13",
    "mmaj13":   "mMaj13",

    // Half-diminished chord extensions
    "m11(b5)": "m11flat5",
    "m11b5":   "m11flat5",
    "m9(b5)":  "m9flat5",
    "m9b5":    "m9flat5",
} as const;

function isQualityAlias(value: string): value is QualityAlias {
    return value in QUALITY_ALIASES;
}

export type QualityAlias = keyof typeof QUALITY_ALIASES;
export {QUALITY_ALIASES, QUALITY_PATTERNS, isQualityAlias}
