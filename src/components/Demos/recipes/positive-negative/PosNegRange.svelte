<script>
  import { onMount } from "svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import css from "./PosNegRange.css?inline";
  /* hide */
  const renderCss = `<style>${css}</style>`;

  export let animate = false;
  /* endhide */

  let value = 0;
  let min = -100;
  let max = 100;

  // determine if the value is positive or negative, and apply the correct CSS class
  $: cssClass = value > 0 ? "positive" : value < 0 ? "negative" : "";
  // calculate the start position % of the range based on the value
  $: start = Math.abs(max / 2 + value / 2);
  // move the range from either 50%-n% (positive) or n%-50% (negative)
  $: range = value > 0 ? `--right: ${100 - start}%; --left: 50%` : `--left: ${start}%; --right: 50%`;

  /* hide */
  onMount(() => {
    if (animate) {
      setTimeout(() => {
        value = 100;
        setTimeout(() => {
          value = -100;
          setTimeout(() => {
            value = 0;
          }, 1000);
        }, 1000);
      }, 1000);
    }
  });
  /* endhide */
</script>

<RangeSlider
  id="pos-neg"
  class={cssClass}
  style={range}
  bind:value
  {min}
  {max}
  suffix="%"
  formatter={(v) => (v > 0 ? `+${v}` : v < 0 ? `-${Math.abs(v)}` : v)}
  float
/>

<!-- hide -->
{@html renderCss}
<!-- endhide -->
