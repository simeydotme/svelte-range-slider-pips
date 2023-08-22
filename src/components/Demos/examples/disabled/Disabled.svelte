<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
  let disabled = false;
  let toggle = () => disabled = !disabled;
</script>

<RangeSlider {disabled} bind:values />

<button type="button" on:click={toggle}>
  {disabled ? 'Enable' : 'Disable'}
</button>

<code data-values title="The output slider values">{disabled} | {values}</code>