import { useEffect, useRef, useState } from 'react';
import RangeSlider from 'svelte-range-slider-pips';

export default function TypicalUsage() {
  const [values, setValues] = useState([10, 50]);
  const nodeRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    sliderRef.current = new RangeSlider({
      target: nodeRef.current,
      props: {
        values: values,
        pips: true,
        float: true,
        first: 'label',
        last: 'label',
      },
    });

    sliderRef.current.$on('change', (e) => {
      setValues(e.detail.values);
    });

    return () => {
      if (sliderRef.current) {
        sliderRef.current.$destroy();
      }
    };
  }, [values]);

  return <div ref={nodeRef}></div>;
}
