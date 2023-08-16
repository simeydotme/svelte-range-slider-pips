<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [20,80];
</script>

<div data-grid>
  <RangeSlider vertical={true} float bind:values />
  <RangeSlider vertical range pips float bind:values />
  <RangeSlider vertical range pips all="label" bind:values />
</div>

<style hide>
  [data-grid] {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 10px;
    justify-items: center;
    align-items: start;
    margin: 1rem;
  }
  [data-grid] :global(.rangeSlider) {
    margin: 1rem 3rem 1rem 0!important;
  }
</style>

<code data-values title="The output slider values">{values}</code>