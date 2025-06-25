<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let value = 50;
  let spring = true;
  const jump = () => value > 50 ? value = 5 : value = 95;
</script>

<RangeSlider bind:value bind:spring />

<div data-flex>
  <label for="springEnabled1">
    <input bind:checked={spring} id="springEnabled1" type="checkbox" /> 
    Enable Spring?
  </label>

<button type="button" on:click={jump}>
  {spring ? 'Smoothly Change' : 'Change Instantly'}
</button>
</div>

<style hide>
  [data-flex] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1em;
  }
  [data-flex] :global(.rangeSlider) {
    margin: 0 0 2em!important;
  }
</style>

<code data-values title="The output slider values">spring: {spring}</code>