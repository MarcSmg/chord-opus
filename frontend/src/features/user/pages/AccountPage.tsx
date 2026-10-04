import { BrowserTabs, type BrowserTab } from "@/shared/ui/BrowserTabs"
import { GeneralSettingsPanel } from "../components/GeneralSettingsPanel";
import { PreferencesPanel } from "../components/PreferencesPanel";
import Heading from "@/shared/ui/Heading";
import { useSearchParams } from "react-router-dom";
import { useMobile } from "@/context/MobileContext";
import { SecuritySettingsPanel } from "../components/SecuritySettingsPanel";

const TAB_IDS = ["general", "preferences", "security"] as const;
const DEFAULT_TAB_ID = TAB_IDS[0];

export const AccountPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTabId = searchParams.get("tab");
  const activeTabId = TAB_IDS.includes(requestedTabId as typeof TAB_IDS[number])
    ? (requestedTabId as typeof TAB_IDS[number])
    : DEFAULT_TAB_ID;

  const { isMobile } = useMobile();

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

  const tabs: BrowserTab[] = [
    {
      id: "general",
      label: "General",
      // icon: <InputSearch width={16} height={16} strokeWidth={2} />,
      content: (
        <GeneralSettingsPanel />
      ),
    },
    {
      id: "preferences",
      label: "Preferences",
      // icon: <ViewGrid width={16} height={16} strokeWidth={2} />,
      content: (
        <PreferencesPanel />
      ),
    },
    {
      id: "security",
      label: "Security Settings",
      content: (
        <SecuritySettingsPanel />
      )
    }
  ];

  return (
    <>
      <section
        className={`min-h-full flex flex-1 flex-col px-5 py-6 pb-24 md:pb-5`}
      >
        <Heading className='mb-4'>Account Settings</Heading>

        {!isMobile ? (
          <BrowserTabs
            className="flex-1"
            activeTabId={activeTabId}
            onActiveTabChange={handleActiveTabChange}
            tabs={tabs}
            tabsPosition="left"
          />
        ) : (
          <></>
        )}
      </section>
    </>
  )

}
