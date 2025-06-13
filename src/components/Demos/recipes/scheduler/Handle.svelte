<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
  import pipsCss from './Basic.css?inline';
  import handleCss from './HandleBasic.css?inline';

  /* hide */
  const renderCss = `<style>${pipsCss} ${handleCss}</style>`;
  /* endhide */
</script>

<RangeSlider 
  class="scheduler handle"
  values={[5, 18]}
  step={0.25}
  max={24}
  pips
  all="label"
/>

<!-- hide -->
{@html renderCss}
<!-- endhide -->