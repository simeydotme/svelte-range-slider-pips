<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [10,50,90];
  let crazy = [10,20,30,40,50,60,70,80,90];
</script>

<RangeSlider bind:values />
<RangeSlider bind:values={crazy} />
<pre><code>{crazy}</code></pre>