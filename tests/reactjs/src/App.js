import React, { useState, useEffect, useRef } from 'react';
import RangeSlider from 'svelte-range-slider-pips';
// import type { ComponentProps } from 'svelte';
// import type { RangeSlider as RangeSliderType } from 'svelte-range-slider-pips';

export default function MyComponent() {
  const [values, setValues] = useState([33, 66]);
  const MySlider = useRef();
  const $node = useRef();

  useEffect(() => {
    if (!MySlider.current) {
      MySlider.current = new RangeSlider({
        target: $node.current,
        props: { values: values, range: true }
      });
      MySlider.current.$on('change', (e) => {
        setValues(e.detail.values);
      });
    }
  }, []);

  function handleClick() {
    const newVals = values.map((v) => v + 10);
    setValues(newVals);
    MySlider.current.$set({ values: newVals });
  }

  return (
    <div>
      <h1>{values.join(',')}</h1>
      <div ref={$node}></div>
      <button onClick={handleClick}>Add 10</button>
    </div>
  );
}
