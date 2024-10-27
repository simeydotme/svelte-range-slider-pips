<script hide>
  import RangeSlider from "svelte-range-slider-pips";
  import css from "./Future.css?inline";
  const renderCss = `<style>${css}</style>`;

  let value = 500000;
  const formatter = (value) => value.toLocaleString("en-US");
</script>

<RangeSlider
  id="future"
  pips
  all="label"
  step={1000}
  pipstep={5}
  float
  min={0}
  max={1000000}
  range="min"
  bind:value
  {formatter}
/>

<!-- hide -->
{@html renderCss}
<!-- endhide -->

<code data-values title="The output slider values">{value}</code>
