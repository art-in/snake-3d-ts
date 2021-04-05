import {useEffect, useState} from 'react';

const QUEUE_SIZE = 3;

export default function useFpsCounter(): number | undefined {
  const [queue, setQueue] = useState<number[]>([]);

  useEffect(() => {
    let framesCount = 0;

    let requestFrameId: number | undefined;
    let setTimeoutId: NodeJS.Timeout;

    const requestNextFrame = () => {
      requestFrameId = requestAnimationFrame(() => {
        framesCount++;
        requestNextFrame();
      });
    };

    const getNextFps = () => {
      setTimeoutId = setTimeout(() => {
        if (queue.length === QUEUE_SIZE) {
          queue.pop();
        }
        queue.unshift(framesCount);
        setQueue([...queue]);
        framesCount = 0;
        getNextFps();
      }, 1000);
    };

    requestNextFrame();
    getNextFps();

    return () => {
      if (requestFrameId !== undefined) {
        cancelAnimationFrame(requestFrameId);
      }
      if (setTimeoutId !== undefined) {
        clearTimeout(setTimeoutId);
      }
    };
  }, []);

  const avgFps = queue.length
    ? Math.round(queue.reduce((acc, cur) => acc + cur, 0) / queue.length)
    : 0;

  return avgFps;
}
