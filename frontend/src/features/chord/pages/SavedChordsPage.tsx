import { useEffect, useMemo, useState } from "react";
import { chordApi } from "../../../api/chords";
import Heading from "../../../shared/ui/Heading";
import type { ApiSavedChordResponse } from "@/types/api";
import { Search } from "iconoir-react";
import { Input } from "@/shared/ui/Input";
import { ChordGridList } from "../components/ChordGridList";
import { ChordDetailPanel } from "../components/ChordDetailPanel";
import { savedChordToDiagram } from "../utils/savedChordToDiagram";
import type { RenderedDiagram } from "@/rendering/buildDiagramLayout";

export const LibraryPage = () => {
  const [savedChords, setSavedChords] = useState<ApiSavedChordResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadSavedChords = async () => {
      try {
        const chords = await chordApi.getAllSavedChords();

        if (isMounted) {
          setSavedChords(chords);
        }
      } catch {
        if (isMounted) {
          setError("Could not load your saved chords.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSavedChords();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredSavedChords = useMemo(
    () =>
      savedChords.filter((ch) =>
        ch.symbol.toLowerCase().includes(query.toLowerCase())
      ),
    [savedChords, query]
  );

  // Rows written under an older/different voicing shape are dropped rather
  // than crashing the grid — see savedChordToDiagram.
  const diagrams = useMemo(
    () =>
      filteredSavedChords
        .map(savedChordToDiagram)
        .filter((diagram): diagram is RenderedDiagram => diagram !== null),
    [filteredSavedChords]
  );

  return (
    <section className="relative min-h-full px-5 py-6 pb-24 md:px-10 md:pb-10">
      <Heading className="mb-4 text-center">Saved Chords</Heading>

      <div className="relative mb-8">
        <Input
          shortcut={true}
          type="text"
          placeholder="Search"
          icon={
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-content-muted"
              strokeWidth={2}
              width={18}
              height={18}
            />
          }
          className="w-full rounded-xl border border-stroke-subtle py-3 pl-11 text-body-sm text-content font-medium outline-0 placeholder:text-content-muted"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
        />
      </div>

      {isLoading && (
        <p className="text-content-muted">Loading saved chords...</p>
      )}

      {error && (
        <p className="rounded-xl bg-status-error-soft p-4 text-status-error">
          {error}
        </p>
      )}

      {!isLoading && !error && diagrams.length === 0 && (
        <p className="text-content-muted">
          {savedChords.length === 0
            ? "You have not saved any chords yet."
            : "No chords match your search."}
        </p>
      )}

      {!isLoading && !error && diagrams.length > 0 && (
        <ChordGridList svgs={diagrams} notFound={false} />
      )}

      <ChordDetailPanel />
    </section>
  );
};
