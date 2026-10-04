import { AppHeader } from "../../../shared/components/AppHeader"
import { ThemeSwitcher } from "../../../shared/ui/ThemeSwitcher"
import { NotificationsPopover } from "@/shared/ui/NotificationsPopover"
import { ProfilePopover } from "@/shared/ui/ProfilePopover"

export const TopNav = () => {
  return (
    <div>
      <nav className="flex items-center justify-between h-15 top-0 left-0 right-0 //border-b border-stroke-subtle z-50">
        <AppHeader
          actions={
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <NotificationsPopover />
              <ProfilePopover />
            </div>
          }
        />
      </nav>
    </div>
  )
}
