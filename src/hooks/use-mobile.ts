import { useEffect, useState } from 'react';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // Set the initial state
    setIsMobile(mediaQuery.matches);

    // Add listener for changes
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  return isMobile;
};
