<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [40,60];
  let min = 0;
  let max = 100;
  let gap = 15;

  /**
   * maintain a distance of 1 between the handles when
   * the user is dragging the handle
   */
   const slide = ({ detail }) => {
    if (detail.activeHandle === 0 && values[1] < detail.value + gap) {
      values[1] = detail.value + gap;
    }
    if (detail.activeHandle === 1 && values[0] > detail.value - gap) {
      values[0] = detail.value - gap;
    }
  };

  /**
   * enforce the gap between the handles when the user
   * stops dragging the handle
   */
  const stop = ({ detail }) => {
    if (detail.activeHandle === 0 && detail.value >= max - gap) {
      values[0] = max - gap;
    }
    if (detail.activeHandle === 1 && detail.value <= min + gap) {
      values[1] = min + gap;
    }
  };
</script>

<RangeSlider range pushy pips bind:values on:change={slide} on:stop={stop} {min } {max} />

<code data-values title="The output slider values">{values}</code>