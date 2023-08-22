<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [25,75];
</script>

<RangeSlider disabled range float bind:values />

<input type="number" bind:value={values[0]}>
<input type="number" bind:value={values[1]}>

<code data-values title="The output slider values">{values}</code>

<style hide>
  input[type=number] {
    width: 8em;
  }
</style>