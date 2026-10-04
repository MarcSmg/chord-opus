import type { MenuItem } from "../../../shared/types/navigation";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MobileNavItem } from "@/shared/ui/MobileNavItem";
import { cn } from "@/shared/utils/cn";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

const SHELL_SPRING = { type: "spring", stiffness: 420, damping: 40, mass: 0.5 } as const;
const TAB_SPRING = { type: "spring", stiffness: 460, damping: 30, mass: 0.55 } as const;
const LABEL_OPEN = { type: "spring", stiffness: 420, damping: 34 } as const;
const LABEL_CLOSE = { duration: 0.16, ease: EASE_OUT } as const;
const CONTENT_SPRING = { type: "spring", stiffness: 380, damping: 32 } as const;

const CONTENT_VARIANTS: Variants = {
    enter: { y: -8, scale: 0.98, opacity: 0, filter: "blur(4px)" },
    center: { y: 0, scale: 1, opacity: 1, filter: "blur(0px)" },
    exit: { y: -6, scale: 0.98, opacity: 0, filter: "blur(4px)", transition: { duration: 0.08, ease: EASE_OUT } },
};

const SubNavLink = ({ to, label, onNavigate }: MenuItem & { onNavigate: () => void }) => (
    <NavLink
        to={to}
        onClick={onNavigate}
        className={({ isActive }) => cn(
            "rounded-2xl px-3 py-2 text-nav transition-colors",
            isActive ? "bg-ui-elevated font-medium text-content" : "text-content-muted hover:text-content"
        )}
    >
        {label}
    </NavLink>
);

// Expandable tab for a menu item that has sub-items: tapping it opens a panel
// above the bar listing its children, instead of navigating directly.
const ExpandableTab = ({ item, isOpen, onToggle }: { item: MenuItem; isOpen: boolean; onToggle: () => void }) => {
    const reduce = useReducedMotion();
    const location = useLocation();
    const hasActiveChild = item.children?.some((child) => location.pathname.startsWith(child.to)) ?? false;
    const isHighlighted = isOpen || hasActiveChild;

    return (
        <motion.button
            type="button"
            aria-expanded={isOpen}
            layout="position"
            transition={reduce ? { duration: 0 } : TAB_SPRING}
            onClick={onToggle}
            className={cn(
                "relative isolate flex h-9 shrink-0 items-center justify-center overflow-hidden rounded-2xl px-2",
                isHighlighted && "pl-2.5 pr-4",
                isHighlighted ? "text-primary" : "text-content-muted hover:text-content"
            )}
        >
            {isHighlighted && (
                <motion.span
                    layoutId="bottom-nav-pill"
                    transition={reduce ? { duration: 0 } : SHELL_SPRING}
                    className="absolute inset-0 -z-10 rounded-2xl bg-accent-soft"
                />
            )}
            <span className="shrink-0">{isHighlighted ? item.activeIcon ?? item.icon : item.icon}</span>
            <motion.span
                initial={false}
                animate={{
                    width: isHighlighted ? "auto" : 0,
                    opacity: isHighlighted ? 1 : 0,
                    marginLeft: isHighlighted ? 8 : 0,
                    filter: !reduce && isHighlighted ? "blur(0px)" : !reduce ? "blur(3px)" : undefined,
                }}
                transition={reduce ? { duration: 0 } : isHighlighted ? LABEL_OPEN : LABEL_CLOSE}
                className="inline-block overflow-hidden whitespace-nowrap font-heading font-medium text-nav"
            >
                {item.label}
            </motion.span>
        </motion.button>
    );
};

export const BottomNav = ({ menuItems }: { menuItems: MenuItem[] }) => {
    const reduce = useReducedMotion();
    const rootRef = useRef<HTMLDivElement>(null);
    const [openTo, setOpenTo] = useState<string | null>(null);
    const active = menuItems.find((item) => item.to === openTo) ?? null;

    useEffect(() => {
        if (!openTo) return;

        const onPointer = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpenTo(null);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpenTo(null);
        };

        document.addEventListener("pointerdown", onPointer);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("pointerdown", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [openTo]);

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 flex flex-col justify-center items-center">
            <motion.div
                ref={rootRef}
                layout
                transition={reduce ? { duration: 0 } : SHELL_SPRING}
                className="relative m-5 mb-5 overflow-hidden rounded-2xl border border-stroke-subtle/60 bg-ui-surface/60 backdrop-blur-sm"
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {active && (
                        <motion.div
                            key={active.to}
                            variants={reduce ? undefined : CONTENT_VARIANTS}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={reduce ? { duration: 0.15, ease: EASE_OUT } : CONTENT_SPRING}
                            style={{ transformOrigin: "bottom center" }}
                            className="flex flex-col gap-1 p-2"
                        >
                            {active.children?.map((child) => (
                                <SubNavLink key={child.to} {...child} onNavigate={() => setOpenTo(null)} />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex items-center justify-between z-50 p-2">
                    {menuItems.map((item) =>
                        item.children && item.children.length > 0 ? (
                            <ExpandableTab
                                key={item.to}
                                item={item}
                                isOpen={item.to === openTo}
                                onToggle={() => setOpenTo(item.to === openTo ? null : item.to)}
                            />
                        ) : (
                            <MobileNavItem
                                key={item.to}
                                className="w-full p-2 justify-center items-center"
                                onClick={() => setOpenTo(null)}
                                {...item}
                            />
                        )
                    )}
                </div>
            </motion.div>
        </nav>
    );
};
