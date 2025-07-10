import { useEffect, useState } from 'react';

type Position = {
  top: number;
  left: number;
  direction: 'up' | 'down';
};

export default function usePopoverPosition(
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLElement>,
  panelHeight: number = 200 // Default estimated panel height
) {
  const [position, setPosition] = useState<Position>({
    top: 0,
    left: 0,
    direction: 'down',
  });

  useEffect(() => {
    function updatePosition() {
      if (isOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;

        const viewportHeight = window.innerHeight;

        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;

        const shouldOpenUp = spaceBelow < panelHeight && spaceAbove > spaceBelow;

        const top = shouldOpenUp
          ? rect.top + scrollY - panelHeight + 25
          : rect.bottom + scrollY;

        const left = rect.left + scrollX;

        setPosition({
          top,
          left,
          direction: shouldOpenUp ? 'up' : 'down',
        });
      }
    }

    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, triggerRef, panelHeight]);

  return position;
}
