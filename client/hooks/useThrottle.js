import { useRef, useCallback } from 'react';
export function useThrottle(callback, delay = 50) {
  const lastCall = useRef(0);
  return useCallback((...args) => {
    const now = new Date().getTime();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      callback(...args);
    }
  }, [callback, delay]);
}
