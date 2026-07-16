import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 1500 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value <= 0) return;
    
    let start = 0;
    const end = value;
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Easing out function
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out
      
      const currentVal = Math.round(easeProgress * end);

      if (frame >= totalFrames) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(currentVal);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
}
