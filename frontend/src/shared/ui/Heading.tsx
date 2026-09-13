import type { ComponentPropsWithRef, ElementType, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface HeadingProps extends ComponentPropsWithRef<"h1"> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}

const Heading = ({ level = 1, children, className = "" }: HeadingProps) => {
  const baseStyles = "font-bold tracking-tight";

  const levels: Record<number, string> = {
    1: "text-header-1 md:text-4xl text-content",
    2: "text-header-2 md:text-3xl text-content",
    3: "text-header-3 text-content",
    4: "text-header-4 text-content",
  };

  // Define the tag dynamically as an ElementType
  const Tag = `h${level}` as ElementType;

  return (
    <Tag className={cn(baseStyles, levels[level], className)}>
      {children}
    </Tag>
  );
};

export default Heading;