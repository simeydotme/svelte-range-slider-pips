<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [1000];
  const currency = new Intl.NumberFormat( "de", { style: 'currency', currency: 'EUR' });
  const formatter = (value) => currency.format(value);
</script>

<RangeSlider {formatter} float pips all="label" max={10000} step={0.1} pipstep={50000} bind:values />

<code data-values title="The output slider values">{values}</code>