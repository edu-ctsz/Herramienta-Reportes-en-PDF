import { useEffect } from 'react';

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.touchAction = '';
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}
