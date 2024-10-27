<script hide>
  import RangeSlider from "svelte-range-slider-pips";
  import css from "./Circles.css?inline";
  const renderCss = `<style>${css}</style>`;
</script>

<RangeSlider id="circles" pips pipstep={1} all="label" />

<!-- hide -->
{@html renderCss}
<!-- endhide -->
 