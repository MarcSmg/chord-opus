import { Fretboard } from '../../../domain/geometry/Fretboard';
import { startTransition, useEffect, useState } from 'react';
import generateSVG from '../utils/generateSVG';
import { ChordSearchResults } from '../components/ChordSearchResults';
import { ChordSearchHeader } from '../components/ChordSearchHeader';
import type { RenderedDiagram } from '../../../rendering/buildDiagramLayout';
import Heading from '@/shared/ui/Heading';
import { BrowserTabs, type BrowserTab } from '@/shared/ui/BrowserTabs';
import { SlidingTabs } from '@/shared/ui/SlidingTabs';
import { useMediaQuery } from '@/shared/hooks/useMediaQuery';

export const ChordSearchPage = () => {
  const [notFound, setNotFound] = useState(false);
  const [input, setInput] = useState("");
  const [svgs, setSvgs] = useState<RenderedDiagram[]>([]);
  const [activeTabId, setActiveTabId] = useState("search");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const fretboard = new Fretboard(21);

  useEffect(() => {
    if (!input.trim()) {
      setSvgs([]);
      setNotFound(false);
      return;
    }
    try {
      const result = generateSVG(input, fretboard);
      // Mounting a whole new grid of SVG diagrams is expensive enough to
      // block the main thread for a while — marking it a transition lets
      // React deprioritize/interrupt that work instead of stalling other
      // pending updates (e.g. the search suggestions dropdown's animation).
      startTransition(() => {
        setSvgs(result);
        setNotFound(result.length === 0);
      });
    } catch {
      startTransition(() => {
        setSvgs([]);
        setNotFound(true);
      });
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const tabs: BrowserTab[] = [
    {
      id: "search",
      label: "Chord Search",
      // icon: <InputSearch width={16} height={16} strokeWidth={2} />,
      content: (
        <>
          <ChordSearchHeader
            input={input}
            onInputChange={handleInputChange}
            onClear={() => setInput("")}
            hasResults={svgs.length > 0}
          />
          <ChordSearchResults svgs={svgs} notFound={notFound} />
        </>
      ),
    },
    {
      id: "fretboard",
      label: "Fretboard Visualizer",
      // icon: <ViewGrid width={16} height={16} strokeWidth={2} />,
      content: (
        <p className="text-content-muted">Fretboard visualizer coming soon.</p>
      ),
    },
  ];

  return (
    <>
      <section
        className="min-h-full flex flex-1 flex-col px-5 py-6 pb-24 md:pb-5"
      >
        <Heading className='mb-4'>Explore Chords</Heading>

        {isDesktop ? (
          <BrowserTabs
            className="flex-1"
            activeTabId={activeTabId}
            onActiveTabChange={setActiveTabId}
            tabs={tabs}
          />
        ) : (
          <SlidingTabs
            className="flex-1"
            activeTabId={activeTabId}
            onActiveTabChange={setActiveTabId}
            tabs={tabs}
          />
        )}
      </section>
    </>
  )

}
