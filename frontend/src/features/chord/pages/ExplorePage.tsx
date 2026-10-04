import { Fretboard } from '../../../domain/geometry/Fretboard';
import { startTransition, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import generateSVG from '../utils/generateSVG';
import { ChordSearchPanel } from '../components/ChordSearchPanel';
import type { RenderedDiagram } from '../../../rendering/buildDiagramLayout';
import Heading from '@/shared/ui/Heading';
import { BrowserTabs, type BrowserTab } from '@/shared/ui/BrowserTabs';
import { SlidingTabs } from '@/shared/ui/SlidingTabs';
import { useMobile } from '@/context/MobileContext';
import { FretboardVisualizerPanel } from '../components/FretboardVisualizerPanel';
import { ChordDetailPanel } from '../components/ChordDetailPanel';
import { ChordDetailProvider } from '@/app/providers/ChordDetailProvider';

const TAB_IDS = ["search", "fretboard"] as const;
const DEFAULT_TAB_ID = TAB_IDS[0];

export const ExplorePage = () => {
  const [notFound, setNotFound] = useState(false);
  const [input, setInput] = useState("");
  const [svgs, setSvgs] = useState<RenderedDiagram[]>([]);
  const { isMobile } = useMobile();
  const fretboard = new Fretboard(21);

  // Keeping the active tab in the URL (rather than useState) means it
  // survives a reload instead of resetting to the first tab.
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTabId = searchParams.get("tab");
  const activeTabId = TAB_IDS.includes(requestedTabId as typeof TAB_IDS[number])
    ? (requestedTabId as typeof TAB_IDS[number])
    : DEFAULT_TAB_ID;

  const handleActiveTabChange = (tabId: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", tabId);
        return next;
      },
      { replace: true }
    );
  };

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
        <ChordSearchPanel
          input={input}
          onInputChange={handleInputChange}
          onClear={() => setInput("")}
          svgs={svgs}
          notFound={notFound}
        />
      ),
    },
    {
      id: "fretboard",
      label: "Fretboard Visualizer",
      // icon: <ViewGrid width={16} height={16} strokeWidth={2} />,
      content: (
        <FretboardVisualizerPanel />
      ),
    },
  ];

  return (
    <ChordDetailProvider>
      <section
        className={`min-h-full flex flex-1 flex-col px-5 py-6 pb-24 md:pb-5`}
      >
        <Heading className='mb-4 text-center'>Explore</Heading>

        {!isMobile ? (
          <div className="relative flex flex-1 items-start gap-4">
            <div className="flex flex-1 h-full items-start gap-4">
              <BrowserTabs
                className="flex-1"
                activeTabId={activeTabId}
                onActiveTabChange={handleActiveTabChange}
                tabs={tabs}
              />
            </div>
            <div className='sticky top-20 w-fit'>
              <ChordDetailPanel active={activeTabId === "search"} />
            </div>
          </div>
        ) : (
          <>
            <SlidingTabs
              className="flex-1"
              activeTabId={activeTabId}
              onActiveTabChange={handleActiveTabChange}
              tabs={tabs}
            />
            <ChordDetailPanel />
          </>
        )}
      </section>
    </ChordDetailProvider>
  )

}
