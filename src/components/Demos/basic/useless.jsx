import { useEffect, useRef } from 'react';
import RangeSlider from 'svelte-range-slider-pips';

export default function UselessSlider() {
  const nodeRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    sliderRef.current = new RangeSlider({
      target: nodeRef.current
    });

    return () => {
      // Cleanup if needed
      if (sliderRef.current) {
        sliderRef.current.$destroy();
      }
    };
  }, []);

  return <div id='useless-slider' ref={nodeRef}></div>;
} 