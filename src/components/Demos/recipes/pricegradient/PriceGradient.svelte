<script>

  import RangeSlider from 'svelte-range-slider-pips';
  import css from './PriceGradient.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  const currency = new Intl.NumberFormat( "en", { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const formatter = (value) => currency.format(value);
  let values = [ 2333, 7878 ];


</script>


<RangeSlider id="PriceGradient" bind:values range float min={0} max={10000} step={1} {formatter} />



{@html renderCss}