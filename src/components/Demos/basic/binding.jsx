import { useEffect, useRef, useState } from 'react';
import RangeSlider from 'svelte-range-slider-pips';

export default function BasicBinding() {
  const [value, setValue] = useState(10);
  const nodeRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    sliderRef.current = new RangeSlider({
      target: nodeRef.current,
      props: {
        min: 0,
        max: 100,
        value: value,
      },
    });

    sliderRef.current.$on('change', (e) => {
      setValue(e.detail.value);
    });

    return () => {
      if (sliderRef.current) {
        sliderRef.current.$destroy();
      }
    };
  }, [value]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.$set({ value });
    }
  }, [value]);

  return (
    <div>
      <div id="binding-slider" ref={nodeRef}></div>
      <input type="number" value={value} onChange={(e) => setValue(e.target.valueAsNumber)} />
    </div>
  );
}
