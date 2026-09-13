import { AnimatePresence, motion } from "motion/react"
import { useRef, type KeyboardEvent, type ReactNode } from "react"
import { Plus, Xmark } from "iconoir-react"
import { cn } from "@/shared/utils/cn"

export interface BrowserTab {
    id: string;
    label: string;
    icon?: ReactNode;
    content?: ReactNode;
}

interface BrowserTabsBaseProps {
    tabs: BrowserTab[];
    activeTabId: string;
    onActiveTabChange: (tabId: string) => void;
    className?: string;
}

type BrowserTabsProps =
    | (BrowserTabsBaseProps & {
        /** Fixed set of tabs — no add/close affordance is shown. */
        dynamicTabs?: false;
    })
    | (BrowserTabsBaseProps & {
        /**
         * Lets the user add/close tabs. `tabs` stays owned by the caller —
         * these are just signals; the caller updates its own `tabs` state
         * (and `activeTabId`, for `onCreateTab`) in response.
         */
        dynamicTabs: true;
        onCreateTab: () => void;
        onCloseTab: (tabId: string) => void;
    });

function Tab({
    tab,
    isActive,
    canClose,
    onSelect,
    onClose,
}: {
    tab: BrowserTab;
    isActive: boolean;
    canClose: boolean;
    onSelect: () => void;
    onClose: () => void;
}) {
    const tabRef = useRef<HTMLLIElement>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
        } else if ((e.key === "Delete" || e.key === "Backspace") && canClose) {
            e.preventDefault();
            onClose();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            (tabRef.current?.nextElementSibling?.querySelector('[role="tab"]') as HTMLElement | null)?.focus();
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            (tabRef.current?.previousElementSibling?.querySelector('[role="tab"]') as HTMLElement | null)?.focus();
        }
    };

    return (
        <motion.li
            ref={tabRef}
            layout
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="relative shrink-0 list-none"
        >
            <div
                role="tab"
                aria-selected={isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={onSelect}
                onKeyDown={handleKeyDown}
                className={cn(
                    "relative flex min-w-[140px] max-w-[220px] cursor-pointer items-center gap-2 px-4 py-2.5 text-nav outline-none transition-colors",
                    isActive ? "text-content" : "text-content-muted hover:text-content"
                )}
            >
                {isActive && (
                    <motion.div
                        layoutId="browserTabActiveBg"
                        className="absolute inset-0 rounded-t-xl bg-ui-card"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    >
                        <div className="absolute -left-3 bottom-0 h-3 w-3 overflow-hidden">
                            <div className="absolute right-0 bottom-0 z-10 h-6 w-6 rounded-full bg-accent-secondary-soft" />
                            <div className="absolute inset-0 bg-ui-card" />
                        </div>
                        <div className="absolute -right-3 bottom-0 h-3 w-3 overflow-hidden">
                            <div className="absolute left-0 bottom-0 z-10 h-6 w-6 rounded-full bg-accent-secondary-soft" />
                            <div className="absolute inset-0 bg-ui-card" />
                        </div>
                    </motion.div>
                )}

                <div className="relative flex min-w-0 flex-1 items-center gap-2">
                    {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                    <span className="flex-1 text-center truncate font-medium select-none">{tab.label}</span>

                    {canClose && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-content-muted transition-colors hover:bg-ui-elevated hover:text-content"
                        >
                            <Xmark width={12} height={12} strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>
        </motion.li>
    );
}

/**
 * A row of browser-style tabs, each rendering its own content below.
 * Pass `dynamicTabs` to let the user add/close tabs at runtime; otherwise
 * the `tabs` list is fixed and no add/close controls are shown.
 */
export const BrowserTabs = (props: BrowserTabsProps) => {
    const { tabs, activeTabId, onActiveTabChange, className = "" } = props;
    const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0];
    const canClose = props.dynamicTabs === true && tabs.length > 1;

    return (
        <div className={cn("flex flex-col bg-accent-secondary-soft rounded-2xl p-1", className)}>
            <div className="flex items-end gap-0 rounded-t-2xl bg-accent-secondary-soft">
                <ol role="tablist" className="no-scrollbar flex flex-1 justify-center items-end overflow-x-auto">
                    <AnimatePresence initial={false}>
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.id}
                                tab={tab}
                                isActive={tab.id === activeTab?.id}
                                canClose={canClose}
                                onSelect={() => onActiveTabChange(tab.id)}
                                onClose={() => props.dynamicTabs && props.onCloseTab(tab.id)}
                            />
                        ))}
                    </AnimatePresence>
                </ol>

                {props.dynamicTabs && (
                    <button
                        type="button"
                        onClick={props.onCreateTab}
                        className="mb-1.5 ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-content-muted transition-colors hover:bg-ui-card hover:text-content"
                    >
                        <Plus width={16} height={16} strokeWidth={2} />
                    </button>
                )}
            </div>

            <div className="flex-1 rounded-2xl bg-ui-card p-4 md:p-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab?.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        {activeTab?.content}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
