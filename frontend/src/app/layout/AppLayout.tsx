import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { HomeAltSlimHoriz, Compass, BookmarkCircle } from 'iconoir-react';
import { ThemeProvider } from "../providers/ThemeProvider"
import Sidebar from './navigation/Sidebar'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './navigation/BottomNav';
import { TopNav } from './navigation/TopNav';
import { SidebarProvider } from '../providers/SidebarProvider';
import { SavedChordsProvider } from '../providers/SavedChordsProvider';
import { MobileProvider } from '../providers/MobileProvider';
import { DeviceProvider } from '../providers/DeviceProvider';

const libraryChildren = [
  { to: "/library", label: "Saved Chords" },
  { to: "/progressions", label: "Progressions" },
];

const desktopSidebarItems = [
  { to: "/home", label: "Home", icon: <HomeAltSlimHoriz strokeWidth={2} width={20} height={20} />, activeIcon: <HomeAltSlimHoriz strokeWidth={2.5} width={20} height={20} /> },
  { to: "/explore", label: "Explore", icon: <Compass strokeWidth={2} width={20} height={20} />, activeIcon: <Compass strokeWidth={2.5} width={20} height={20} /> },
  { to: "/library", label: "Library", icon: <BookmarkCircle strokeWidth={2} width={20} height={20} />, activeIcon: <BookmarkCircle strokeWidth={2.5} width={20} height={20} />, children: libraryChildren },
];

const mobileNavbarItems = [
  { to: "/home", label: "Home", icon: <HomeAltSlimHoriz strokeWidth={2} width={20} height={20} />, activeIcon: <HomeAltSlimHoriz strokeWidth={2.5} width={20} height={20} /> },
  { to: "/explore", label: "Explore", icon: <Compass strokeWidth={2} width={20} height={20} />, activeIcon: <Compass strokeWidth={2.5} width={20} height={20} /> },
  { to: "/library", label: "Library", icon: <BookmarkCircle strokeWidth={2} width={20} height={20} />, activeIcon: <BookmarkCircle strokeWidth={2.5} width={20} height={20} />, children: libraryChildren },
];

export const AppLayout = () => {
  // The app shell scrolls internally (this `main`), not the window, so Lenis
  // is pointed at it directly instead of using its root/window mode.
  const scrollWrapperRef = useRef<HTMLElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollWrapperRef.current || !scrollContentRef.current) return;

    const lenis = new Lenis({
      wrapper: scrollWrapperRef.current,
      content: scrollContentRef.current,
      autoRaf: true,
    });

    return () => lenis.destroy();
  }, []);

  return (
    <ThemeProvider>
      <MobileProvider>
        <DeviceProvider>
          <SidebarProvider>
            <SavedChordsProvider>
              <div
                className="flex flex-col w-full h-screen"
              >
                <TopNav />
                <div className='overflow-hidden md:flex flex-1'>
                  <Sidebar menuItems={desktopSidebarItems} />
                  <main ref={scrollWrapperRef} className='flex-1 flex flex-col h-full overflow-y-auto'>
                    <div ref={scrollContentRef} className="flex flex-1 flex-col">
                      <Outlet />
                      <BottomNav menuItems={mobileNavbarItems} />
                    </div>
                  </main>
                </div>
              </div>
            </SavedChordsProvider>
          </SidebarProvider>
        </DeviceProvider>
      </MobileProvider>
    </ThemeProvider>
  )
}
