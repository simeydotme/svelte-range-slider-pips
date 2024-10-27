<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [25,75];
</script>

<p>Regular (with Hover)</p> 
<RangeSlider float range bind:values />

<p>No Hover</p>
<RangeSlider float hoverable={false} range bind:values />

<code data-values title="The output slider values">{values}</code>

<style>
  p {
    margin-block-start: 2rem;
    margin-block-end: -2rem;
  }
</style>