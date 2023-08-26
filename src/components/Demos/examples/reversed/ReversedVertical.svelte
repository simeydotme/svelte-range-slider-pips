<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [0,60];
</script>

<div data-grid>

  <p>Normal</p>
  <RangeSlider vertical pips all="label" float range bind:values pipstep={20} />

  <p>Reversed</p>
  <RangeSlider reversed vertical pips all="label" float range bind:values pipstep={20} />

</div>

<code data-values title="The output slider values">{values}</code>


<style hide>
  [data-grid] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    justify-items: center;
  }
  [data-grid] :global(.rangeSlider) {
    margin: 2em 0 1em -2em!important;
  }
  [data-grid] p {
    grid-row: 2;
  }
</style>