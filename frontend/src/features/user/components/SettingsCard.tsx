import type { ReactNode } from "react";
import Heading from "@/shared/ui/Heading";

interface SettingsCardProps {
    title: string;
    action?: ReactNode;
    children: ReactNode;
}

export const SettingsCard = ({ title, action, children }: SettingsCardProps) => (
    <div className="rounded-2xl border border-stroke-subtle bg-ui-card p-5">
        <div className="mb-4 flex items-center justify-between gap-4">
            <Heading level={4} className="mb-0">{title}</Heading>
            {action}
        </div>
        {children}
    </div>
);
