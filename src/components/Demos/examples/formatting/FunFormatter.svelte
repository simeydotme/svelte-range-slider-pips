<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [0];
  const scores = Array.from({length: 5}, () =>  "⭐" );
</script>

<span class="floating-head">
  {scores[values[0]].repeat(values[0]+1)}
</span>

<!-- hide -->
<div class="slider-wrapper">
<!-- endhide -->

<RangeSlider formatter={ v => scores[v] } max={ scores.length - 1 } range="min"
  pips all="label" bind:values />
  <!-- hide -->
</div>
<!-- endhide -->

<code data-values title="The output slider values">{values}</code>

<!-- hide -->
<style>
  .floating-head { position: absolute; top: 0; right: 1.5em; font-size: 1.625em; }
  .slider-wrapper :global(.pipVal) { font-size: 1.25em; opacity: 0.5; filter: saturate(0); top: -0.25em; }
  .slider-wrapper :global(.rangePips .pip.in-range .pipVal),
  .slider-wrapper :global(.rangePips .pip.selected .pipVal) { font-size: 2em; opacity: 1; filter: saturate(1); top: -0.25em; }
</style>
<!-- endhide -->