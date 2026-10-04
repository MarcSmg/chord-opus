import { Bell } from "iconoir-react";
import { Tooltip } from "./Tooltip";
import Heading from "./Heading";
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger, usePopover } from "./Popover";

const NotificationsTrigger = () => {
    const { isOpen } = usePopover();

    return (
        <Tooltip label="Notifications" placement="bottom" disabled={isOpen}>
            <button
                type="button"
                aria-label="Notifications"
                aria-expanded={isOpen}
                className="grid size-9 place-items-center rounded-full border border-stroke-subtle cursor-pointer bg-ui-card text-content-muted shadow-detail-sm outline-none transition-colors hover:bg-accent-soft focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-ui-surface"
            >
                <Bell aria-hidden="true" height={19} strokeWidth={2} width={19} />
            </button>
        </Tooltip>
    );
};

export const NotificationsPopover = () => (
    <Popover>
        <PopoverTrigger>
            <NotificationsTrigger />
        </PopoverTrigger>

        <PopoverContent className="w-80 max-w-[calc(100vw-2.5rem)]">
            <PopoverHeader className="border-b border-stroke-subtle">
                <Heading level={4} className="mb-0">Notifications</Heading>
            </PopoverHeader>

            <p className="px-4 py-8 text-center text-body-sm text-content-muted">
                You're all caught up.
            </p>
        </PopoverContent>
    </Popover>
);
