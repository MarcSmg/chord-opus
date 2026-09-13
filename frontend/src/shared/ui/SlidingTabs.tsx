import { useEffect, useRef, useState, type Ref } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { BrowserTab } from "./BrowserTabs";
import { cn } from "@/shared/utils/cn";

interface SlidingTabsProps {
    tabs: BrowserTab[];
    activeTabId: string;
    onActiveTabChange: (tabId: string) => void;
    className?: string;
}

interface PillPosition {
    left: number;
    width: number;
    opacity: number;
}

function Tab({
    ref,
    tab,
    isActive,
    onSelect,
    onHover,
}: {
    ref: Ref<HTMLButtonElement>;
    tab: BrowserTab;
    isActive: boolean;
    onSelect: () => void;
    onHover: () => void;
}) {
    return (
        <button
            ref={ref}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={onSelect}
            onMouseEnter={onHover}
            className={cn(
                "relative z-10 flex shrink-0 items-center gap-1.5 whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors duration-200",
                isActive ? "text-content" : "text-content-muted hover:text-content"
            )}
        >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
        </button>
    );
}

/**
 * A pill-style tab switcher: the highlighted pill slides to and measures the
 * real position/width of each tab (so tabs can be any length, not just equal
 * width), and previews on hover before snapping back on mouse-leave.
 *
 * Shares `BrowserTab`'s shape, so it can be swapped in for `BrowserTabs` with
 * the same `tabs`/`activeTabId`/`onActiveTabChange` props — e.g. as a more
 * compact mobile alternative past a breakpoint.
 */
export const SlidingTabs = ({ tabs, activeTabId, onActiveTabChange, className = "" }: SlidingTabsProps) => {
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [pill, setPill] = useState<PillPosition>({ left: 0, width: 0, opacity: 0 });

    const activeIndex = tabs.findIndex((tab) => tab.id === activeTabId);
    const activeTab = tabs[activeIndex] ?? tabs[0];

    const measure = (index: number) => {
        const el = tabRefs.current[index];
        if (!el) return;
        setPill({ left: el.offsetLeft, width: el.getBoundingClientRect().width, opacity: 1 });
    };

    useEffect(() => {
        measure(activeIndex);

        // Natural tab widths can shift on resize (wrapping, responsive font sizes).
        const handleResize = () => measure(activeIndex);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeIndex, tabs.length]);

    return (
        <div className={cn("flex flex-col", className)}>
            <ul
                role="tablist"
                onMouseLeave={() => measure(activeIndex)}
                className="relative flex w-fit list-none items-center justify-center gap-1 self-center rounded-full border border-stroke-subtle bg-accent-secondary-soft p-1 shadow-detail-sm"
            >
                <motion.li
                    aria-hidden
                    animate={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
                    transition={{ type: "spring", stiffness: 350, damping: 35 }}
                    className="absolute inset-y-1 z-0 rounded-full border border-stroke-strong/10 bg-ui-card shadow-detail-sm"
                />

                {tabs.map((tab, index) => (
                    <Tab
                        key={tab.id}
                        ref={(el) => {
                            tabRefs.current[index] = el;
                        }}
                        tab={tab}
                        isActive={tab.id === activeTab?.id}
                        onSelect={() => onActiveTabChange(tab.id)}
                        onHover={() => measure(index)}
                    />
                ))}
            </ul>

            {activeTab?.content && (
                <div className="mt-4 flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            {activeTab.content}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
