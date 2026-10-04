import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuthShellProps {
  children: ReactNode;
  activeKey: string;
}

export const AuthShell = ({ children, activeKey }: AuthShellProps) => (
  <div className="w-full">
    <motion.div animate={{ height: 'auto' }}>
        <AnimatePresence mode="wait" initial={false}>
        <motion.div
            key={activeKey}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            {children}
        </motion.div>
        </AnimatePresence>
    </motion.div>
  </div>
);