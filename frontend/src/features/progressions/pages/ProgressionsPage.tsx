import { useEffect, useMemo, useState } from "react";
import { NavArrowDown, Plus, Search } from "iconoir-react";
import { chordApi } from "@/api/chords";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import Heading from "@/shared/ui/Heading";
import type { ApiProgressionResponse } from "@/types/api";
import { ProgressionCard } from "../components/ProgressionCard";

export const ProgressionsPage = () => {
  const [progressions, setProgressions] = useState<ApiProgressionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProgressions = async () => {
      try {
        const data = await chordApi.getProgressions();

        if (isMounted) {
          setProgressions(data);
        }
      } catch {
        if (isMounted) {
          setError("Could not load your progressions.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProgressions();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProgressions = useMemo(
    () =>
      progressions.filter((progression) =>
        progression.title.toLowerCase().includes(query.toLowerCase())
      ),
    [progressions, query]
  );

  return (
    <section className="min-h-full px-5 py-6 pb-24 md:px-10 md:pb-10">
      <Heading className="mb-4 text-center">Progressions</Heading>

      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          className="flex items-center gap-1 text-body-sm font-medium text-content"
        >
          All
          <NavArrowDown width={16} height={16} strokeWidth={2} />
        </button>

        <Button variant="primary" icon={<Plus strokeWidth={2.5} />} className="shrink-0 cursor-pointer rounded-full">
          New
        </Button>
      </div>

      <div className="relative mt-4 mb-8">
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
          className="w-full rounded-xl border border-stroke-subtle bg-ui-card py-3 pl-11 text-body-sm text-content font-medium outline-0 placeholder:text-content-muted"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery("")}
        />
      </div>

      {isLoading && (
        <p className="text-content-muted">Loading progressions...</p>
      )}

      {error && (
        <p className="rounded-xl bg-status-error-soft p-4 text-status-error">
          {error}
        </p>
      )}

      {!isLoading && !error && filteredProgressions.length === 0 && (
        <p className="text-content-muted">
          {progressions.length === 0
            ? "You have not created any progressions yet."
            : "No progressions match your search."}
        </p>
      )}

      {!isLoading && !error && filteredProgressions.length > 0 && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {filteredProgressions.map((progression) => (
            <ProgressionCard key={progression.id} progression={progression} />
          ))}
        </div>
      )}
    </section>
  );
};
