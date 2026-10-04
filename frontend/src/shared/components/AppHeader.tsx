// src/components/sidebar/SidebarHeader.tsx
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import Heading from '../ui/Heading';

interface AppHeaderProps {
  actions?: ReactNode;
}

export const AppHeader = ({ actions }: AppHeaderProps) => {
  return (
    <div className="flex w-full items-center justify-between gap-3 px-6 ">
      
      <Link to="/" className="group">
        <Heading level={4} className="font-black text-content group-hover:text-primary transition-colors">
          ChordOpus
        </Heading>
      </Link>
      {actions}
    </div>
  );
};
