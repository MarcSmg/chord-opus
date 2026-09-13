import { motion, type Variants } from "motion/react";

interface MenuActionProps {
    icon: React.ReactNode;
    label?: string;
    variants?: Variants;
    onClick?: () => void; // The callback function
}

export const MenuAction = ({ icon, label, variants, onClick }: MenuActionProps) => (
    <motion.button
        variants={variants}
        onClick={(e) => {
            onClick && onClick();
            e.stopPropagation()
        }}
        className="flex justify-center items-center gap-3 size-8 px-3 py-2 text-sm text-content cursor-pointer rounded-full transition-colors group"
    >
        {icon && <span className="text-content-muted group-hover:text-primary transition-colors">
            {icon}
        </span>}
        {label && <span className="font-medium">{label}</span>}
    </motion.button>
);