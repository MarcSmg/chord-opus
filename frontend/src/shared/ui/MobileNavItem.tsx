import type { ComponentPropsWithRef, ReactNode } from "react";
import { useSidebar } from "@/context/SidebarContext";
import { Tooltip } from "./Tooltip";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/shared/utils/cn";

interface NavItemProps extends Omit<ComponentPropsWithRef<"div">, "children"> {
    to: string,
    label?: string,
    icon?: ReactNode,
    activeIcon?: ReactNode,
    onClick?: () => void,
}

export const MobileNavItem = ({ to, label, activeIcon, icon, className, onClick }: NavItemProps) => {
    const { isSidebarExtended } = useSidebar();

    return (
        <Tooltip label={label} placement="right" disabled={isSidebarExtended}>
            <NavLink
                to={to}
                onClick={onClick}
                className={({ isActive }) => cn(
                    "flex items-center rounded-xl px-3 py-2",
                    className,
                    isActive ? "md:text-content md:bg-accent-soft" : "hover:bg-accent-soft/40 transition-colors duration-200"
                )}
            >
                {({ isActive }) => (<>
                    <span key="icon" className={cn("shrink-0", isActive ? "text-primary" : "text-content-muted")}>
                        {isActive ? activeIcon : icon}
                    </span>
                    <AnimatePresence>
                        {(isSidebarExtended || isActive) &&
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