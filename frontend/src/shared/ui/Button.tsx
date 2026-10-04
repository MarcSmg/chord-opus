import type { MouseEventHandler, ReactNode } from "react"
import { cn } from "@/shared/utils/cn"

interface ButtonProps {
    variant?: "primary" | "secondary";
    type?: "submit";
    icon?: ReactNode;
    children?: ReactNode;
    className?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

export const Button = ({
    variant,
    children,
    className,
    icon,
    type,
    onClick,
    disabled,
}: ButtonProps) => {

    const baseStyles = "flex items-center justify-center gap-2 rounded-xl px-2 py-1 cursor-pointer text-button-label font-medium disabled:cursor-not-allowed disabled:bg-ui-elevated disabled:text-content-disabled transition-all";
    const primaryStyles = "px-4 py-2 bg-accent-bold border-2 border-accent-bold text-white";
    const secondaryStyles = "px-4 py-2 bg-ui-card/50 backdrop-blur-lg text-accent-secondary border-2 border-accent-secondary hover:bg-accent-secondary-soft";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                baseStyles,
                variant === "primary" && primaryStyles,
                variant === "secondary" && secondaryStyles,
                className
            )}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    )
}
