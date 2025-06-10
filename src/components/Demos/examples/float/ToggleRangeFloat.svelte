<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './ToggleRangeFloat.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
  let values = [25,75];

</script>

<RangeSlider 
  id="toggle-range-float"
  bind:values 
  range
  rangeFloat={values[1] - values[0] < 22} 
  float={values[1] - values[0] >= 22} 
/>

<p>Try dragging the handles close to each other</p>

<code data-values title="The output slider values">{values}</code>

<!-- hide -->
{@html renderCss}
<!-- endhide -->