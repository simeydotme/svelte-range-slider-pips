<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [20,80];
</script>

<RangeSlider id="sliderInRange" range pips bind:values />

<style hide>
  :global(#sliderInRange .rangePips :is(.in-range, .selected)) {
    background: #f00;
    width: 2px;
  }
</style>

<code data-values title="The output slider values">{values}</code>