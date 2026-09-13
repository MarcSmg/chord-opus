import { Tooltip } from "@/shared/ui/Tooltip"
import { AppHeader } from "../../../shared/components/AppHeader"
import { ThemeSwitcher } from "../../../shared/ui/ThemeSwitcher"
import { Bell, ProfileCircle } from "iconoir-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/shared/utils/cn"

export const TopNav = () => {
  return (
    <div>
      <nav className="flex items-center justify-between h-15 top-0 left-0 right-0 border-b border-stroke-subtle z-50">
        <AppHeader
          actions={
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Tooltip label="Notifications" placement="bottom-right">
                <span className="grid size-9 place-items-center rounded-full border border-stroke-subtle cursor-pointer bg-ui-card text-content-muted shadow-detail-sm outline-none transition-colors hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-ui-surface">
                  <Bell aria-hidden="true" height={19} strokeWidth={2} width={19} />
                </span>
              </Tooltip>
              <Tooltip label="My Profile" placement="bottom-right">

                <NavLink
                  aria-label="Profile"
                  className={({ isActive }) => cn(
                    "grid size-9 place-items-center rounded-full border border-stroke-subtle bg-ui-card shadow-detail-sm outline-none transition-colors hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-ui-surface",
                    isActive ? "bg-accent-soft text-primary" : "text-content-muted"
                  )}
                  to="/profile"
                >
                  <ProfileCircle aria-hidden="true" height={19} width={19} strokeWidth={2}  />
                </NavLink>
              </Tooltip>

            </div>
          }
        />
      </nav>
    </div>
  )
}
