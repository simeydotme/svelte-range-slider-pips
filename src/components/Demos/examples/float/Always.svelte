<script hide>
  import RangeSlider from "svelte-range-slider-pips";
  let values = [25, 75];
</script>

<RangeSlider id="always" float range bind:values />

<style>
  :global(#always .rangeFloat) {
    opacity: 1;
  }
</style>
