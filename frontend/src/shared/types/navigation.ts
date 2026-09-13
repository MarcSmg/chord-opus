import type { ReactNode } from "react";

export interface MenuItem {
    to: string,
    label: string,
    icon?: ReactNode,
    activeIcon?: ReactNode,
    children?: MenuItem[]
}