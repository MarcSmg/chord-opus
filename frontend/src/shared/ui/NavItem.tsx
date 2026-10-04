import { AnimatePresence, motion } from "motion/react"
import type { ComponentPropsWithRef, ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { NavLink, useLocation } from "react-router-dom"
import { NavArrowDown, NavArrowRight } from "iconoir-react"
import type { MenuItem } from "../types/navigation"
import { Tooltip } from "./Tooltip"
import { useSidebar } from "@/context/SidebarContext"
import { cn } from "@/shared/utils/cn"

interface NavItemProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
  to: string,
  label?: string,
  icon?: ReactNode,
  activeIcon?: ReactNode,
  children?: MenuItem[]
}

function useHoverFlyout<T extends HTMLElement>() {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<T>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setPosition({ top: rect.top, left: rect.right + 12 });
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => setIsHovered(false);

  return { ref, isHovered, position, handleMouseEnter, handleMouseLeave };
}

const ChildLink = ({ to, label }: MenuItem) => (
  <NavLink
    to={to}
    className={({ isActive }) => cn(
      "flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-nav transition-colors",
      isActive ? "bg-ui-elevated font-medium text-content" : "text-content-muted hover:text-content"
    )}
  >
    {({ isActive }) => (
      <>
        <span>{label}</span>
        {isActive && <NavArrowRight className="shrink-0" width={14} height={14} strokeWidth={2} />}
      </>
    )}
  </NavLink>
)

const NestedNavItem = ({ label, icon, activeIcon, children = [] }: NavItemProps) => {
  const location = useLocation();
  const hasActiveChild = children.some((child) => location.pathname.startsWith(child.to));

  const [isOpen, setIsOpen] = useState(hasActiveChild);
  const isHighlighted = isOpen || hasActiveChild;
  const { ref, isHovered, position, handleMouseEnter, handleMouseLeave } = useHoverFlyout<HTMLDivElement>();

  // `isOpen` is otherwise just manual toggle state, so it doesn't know when
  // navigation has moved us off this section entirely (e.g. clicking a
  // different top-level item) — resync it to the route on every navigation
  // without clobbering a manual toggle in between.
  useEffect(() => {
    setIsOpen(hasActiveChild);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const {isSidebarExtended} = useSidebar();

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center rounded-xl px-3 py-2 transition-colors duration-200",
          isHighlighted ? "text-content bg-accent-secondary-soft" : "text-content-muted hover:bg-accent-secondary-soft/40"
        )}
      >
        <span className={cn("shrink-0", isHighlighted && "text-accent-secondary")}>{isHighlighted ? activeIcon ?? icon : icon}</span>
        <AnimatePresence>
          {isSidebarExtended && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0, marginLeft: 0 }}
              animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
              exit={{ opacity: 0, width: 0, marginLeft: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap font-heading font-medium text-nav"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
        {isSidebarExtended && (
          <NavArrowRight
            className={cn("ml-auto shrink-0 transition-transform duration-200", isOpen && "rotate-90")}
            width={14}
            height={14}
            strokeWidth={2}
          />
        )}
      </button>

      {isSidebarExtended && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 ml-5 flex flex-col gap-1 border-l border-stroke-subtle pl-4">
                {children.map((child) => (
                  <ChildLink key={child.to} {...child} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {!isSidebarExtended &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                transition={{ duration: 0.15, delay: 0.2 }}
                style={{ top: position.top, left: position.left }}
                className="fixed z-50 flex flex-col gap-2"
              >
                <span className="w-fit rounded-lg bg-content px-3 py-1.5 text-nav font-medium text-ui-bg whitespace-nowrap">
                  {label}
                </span>
                <div className="w-48 rounded-2xl border border-stroke-subtle bg-ui-card p-2 shadow-detail-md">
                  <div className="flex flex-col gap-1">
                    {children.map((child) => (
                      <ChildLink key={child.to} {...child} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  )
}

export const NavItem = ({ to, label, activeIcon, icon, className, children }: NavItemProps) => {
  const {isSidebarExtended} = useSidebar();
  if (children && children.length > 0) {
    return (
      <NestedNavItem
        to={to}
        label={label}
        icon={icon}
        activeIcon={activeIcon}
        children={children}
      />
    )
  }

  return (
    <Tooltip label={label} placement="right" disabled={isSidebarExtended}>
      <NavLink
        to={to}
        className={({ isActive }) => cn(
          "flex items-center rounded-xl px-3 py-2",
          className,
          isActive ? "md:text-content md:bg-accent-secondary-soft" : "hover:bg-accent-secondary-soft/40 transition-colors duration-200"
        )}
      >
        {({ isActive }) => (<>
          <span key="icon" className={cn("shrink-0", isActive ? "text-accent-secondary" : "text-content-muted")}>
            {isActive ? activeIcon : icon}
          </span>
          <AnimatePresence>
            {isSidebarExtended &&
              <motion.span
                key="label"
                initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap font-heading font-medium text-nav"
              >
                {label}
              </motion.span>
            }
          </AnimatePresence>
        </>
        )}
      </NavLink>
    </Tooltip>
  )
}
