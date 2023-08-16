<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [1000];
  const currency = new Intl.NumberFormat( "jp", { style: 'currency', currency: 'JPY' });
  const short = new Intl.NumberFormat( "jp", { style: 'currency', currency: "JPY", notation: "compact" });
  const handleFormatter = (value) => currency.format(value);
  const formatter = (value) => short.format(value);
  const max = 10000000;
</script>

<RangeSlider {formatter} {handleFormatter} {max} pipstep={max/2} step={1} float pips all="label" bind:values />

<code data-values title="The output slider values">{values}</code>