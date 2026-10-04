import { NavLink } from "react-router-dom";
import { LogOut, ProfileCircle, Settings } from "iconoir-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/shared/utils/cn";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger, usePopover } from "./Popover";
import Heading from "./Heading";

const menuItemClass = "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-nav transition-colors cursor-pointer";

const ProfileTrigger = () => {
    const { isOpen } = usePopover();

    return (
        <button
            type="button"
            aria-label="Profile"
            aria-haspopup="menu"
            aria-expanded={isOpen}
            className="grid size-9 place-items-center rounded-full border border-stroke-subtle bg-ui-card text-content-muted shadow-detail-sm outline-none transition-colors cursor-pointer hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-ui-surface"
        >
            <ProfileCircle aria-hidden="true" height={19} width={19} strokeWidth={2} />
        </button>
    );
};

export const ProfilePopover = () => {
    const { user, logout } = useAuth();

    const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.username;

    return (
        <Popover>
            <PopoverTrigger>
                <ProfileTrigger />
            </PopoverTrigger>

            <PopoverContent align="end" className="flex flex-col p-2 gap-2">
                <PopoverHeader className="border-b border-stroke-subtle mb-2">
                    <Heading level={6} className="mb-0">{fullName}</Heading>
                    <p className="text-label text-content-muted">{user?.email}</p>
                </PopoverHeader>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => cn(
                        menuItemClass,
                        isActive ? "bg-ui-elevated font-medium text-content" : "text-content-muted hover:bg-ui-elevated hover:text-content"
                    )}
                >
                    <Settings width={16} height={16} strokeWidth={2} />
                    Account Settings
                </NavLink>

                <button type="button" onClick={logout} className={cn(menuItemClass, "text-status-error hover:bg-status-error-soft")}>
                    <LogOut width={16} height={16} strokeWidth={2} />
                    Logout
                </button>
            </PopoverContent>
        </Popover>
    );
};
