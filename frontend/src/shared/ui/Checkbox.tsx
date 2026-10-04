import type { ComponentPropsWithRef } from "react";
import { cn } from "@/shared/utils/cn";

interface CheckboxProps extends Omit<ComponentPropsWithRef<"input">, "type"> {}

export const Checkbox = ({ className, ...props }: CheckboxProps) => {
  return (
    <input
        type="checkbox"
        className={cn(
            "size-4 shrink-0 cursor-pointer rounded-md border-2 border-stroke-strong accent-primary outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-ui-surface",
            className
        )}
        {...props}
    />
  )
}
