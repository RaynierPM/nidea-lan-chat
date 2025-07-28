import React, { ReactNode, useEffect } from "react";
import { cn } from "../../utils/cn.util";

type PopOverProps = {
  position?: 'top' | 'bottom' | 'left' | 'right';
  children?: React.ReactNode;
  className?: string;
  onOpenChange?: (isOpen: boolean) => void;
  isOpen?: boolean;
  anchorElement?: ReactNode | null;
  triggerElement?: ReactNode | null;
}

const positionClasses = {
  top: 'absolute bottom-full left-1/2 -translate-x-12',
  bottom: 'absolute top-full left-1/2 -translate-x-12',
  left: 'absolute right-full top-1/2 -translate-y-1/2',
  right: 'absolute left-full top-1/2 -translate-y-1/2'
}

export function PopOver({
  position = 'bottom',
  children,
  className = '',
  onOpenChange,
  isOpen = false,
  triggerElement
}: PopOverProps) {
  const positionClass = positionClasses[position] || positionClasses.bottom;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const popoverElement = document.querySelector('#popover-container');
      if (popoverElement && !popoverElement.contains(event.target as Node)) {
        onOpenChange?.(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onOpenChange?.(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [])
  
  return (
    <div 
      className="relative"
      id="popover-container"
    >
      <div 
        onClick={() => {onOpenChange?.(!isOpen)}}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onOpenChange?.(false);
          }
        }}
      >
        {triggerElement}
      </div>
      <div className={cn(
        className,
        positionClass,
         " z-50 ", 
         isOpen ? "block" : "hidden"
      )}>
        {children}
      </div>
    </div>
  )
}