<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './Basic.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
</script>

<RangeSlider 
  class="scheduler"
  step={0.25}
  max={24}
  pips
  all="label"
/>

<!-- hide -->
{@html renderCss}
<!-- endhide -->