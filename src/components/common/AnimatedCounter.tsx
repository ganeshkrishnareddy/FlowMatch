import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 1500 }: AnimatedCounterProps) {
  // If the initial value is greater than 0 (e.g. from cache), we start directly at the value.
  // Otherwise we start at 0.
  const [count, setCount] = useState(value > 0 ? value : 0);
  const prevValueRef = useRef(value);

  useEffect(() => {
    // If value hasn't changed or we are transitioning to 0, just set it
    if (value === prevValueRef.current || value <= 0) {
      setCount(value);
      prevValueRef.current = value;
      return;
    }
    
    const start = prevValueRef.current;
    const end = value;
    const frameRate = 1000 / 60; // 60 FPS
    
    // If the difference is very small (e.g., updating cached 5120 to 5123), animate very fast.
    const diff = Math.abs(end - start);
    const actualDuration = diff < 50 ? 500 : duration; 
    
    const totalFrames = Math.max(1, Math.round(actualDuration / frameRate));
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Cubic ease out
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 3); 
      
      const currentVal = start + (end - start) * easeProgress;

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.round(currentVal));
      }
    }, frameRate);

    prevValueRef.current = value;
    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}
