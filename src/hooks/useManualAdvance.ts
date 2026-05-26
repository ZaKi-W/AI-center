import { useEffect, useRef } from 'react';

export function useManualAdvance(
  playbackMode: 'auto' | 'manual',
  advanceSignal: number,
  onAdvance: () => void,
) {
  const signalRef = useRef(advanceSignal);
  const advanceRef = useRef(onAdvance);

  useEffect(() => {
    advanceRef.current = onAdvance;
  }, [onAdvance]);

  useEffect(() => {
    if (advanceSignal === signalRef.current) return;
    signalRef.current = advanceSignal;
    if (playbackMode === 'manual') advanceRef.current();
  }, [advanceSignal, playbackMode]);
}
