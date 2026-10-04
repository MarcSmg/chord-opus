import type { ComponentPropsWithRef, ReactNode } from "react";
import { Input } from "@/shared/ui/Input";
import { Button } from "@/shared/ui/Button";
import GoogleIcon from "@/assets/google-icon.svg";
import { cn } from "@/shared/utils/cn";

// `pl-11`/`pl-4` (icon vs no icon) is applied by AuthField itself based on
// whether `icon` is passed, rather than being baked in here or left to each
// caller to override — two plain padding-left utilities on the same element
// don't reliably override one another regardless of source order.
export const authInputStyles = "w-full pr-4 py-2.5 font-heading font-medium border-2 border-stroke-strong rounded-2xl outline-0 outline-accent-secondary/50 shadow-md focus:outline-3 focus:bg-ui-card transition-all duration-100";
export const authIconStyles = "absolute left-4 text-stroke-strong";

interface AuthFieldProps extends Omit<ComponentPropsWithRef<"input">, "value" | "onChange"> {
    label: string;
    icon?: ReactNode;
    // Narrowed from the native input's wider/optional types to match what Input requires.
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthField = ({ label, icon, id, className, value, ...props }: AuthFieldProps) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor={id} className="text-label font-medium text-content-muted">{label}</label>
        <Input value={value} id={id} icon={icon} className={cn(authInputStyles, icon ? "pl-12" : "pl-4", className)} {...props} />
    </div>
);

export const AuthDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-stroke-subtle" />
        <span className="text-label text-content-muted">{label}</span>
        <span className="h-px flex-1 bg-stroke-subtle" />
    </div>
);

// No Google OAuth backend yet — shown (rather than hidden) to set expectations,
// disabled rather than silently doing nothing on click.
export const GoogleButton = () => (
    <Button
        // disabled
        icon={<img className="size-5" src={GoogleIcon} alt="" />}
        className="w-full rounded-2xl border border-stroke-strong/50 bg-ui-card py-2.5 text-content"
    >
        Google
    </Button>
);
