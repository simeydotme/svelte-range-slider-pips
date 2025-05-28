<script hide>
  import RangeSlider from "svelte-range-slider-pips";
  let values = [25, 75];
</script>

<RangeSlider id="always" float range bind:values />

<style>
  /* to style inside of a Svelte component, we need to use :global() */
  :global(#always .rangeFloat) {
    opacity: 1;
    translate: -50% 0%;
  }
</style>
