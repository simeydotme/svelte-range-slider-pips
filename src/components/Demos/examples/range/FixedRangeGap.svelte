<script>
  import RangeSlider from 'svelte-range-slider-pips';
  const gap = 20;
  let values = [40, 40 + gap];
</script>

<RangeSlider 
  range 
  rangeGapMin={gap} 
  rangeGapMax={gap}
  rangeFloat 
  draggy 
  pushy 
  pips 
  bind:values 
/>

<strong><em>Try dragging the range to move it.</em></strong>

<code data-values title="The output slider values">{values}</code>