<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let value = 11;
  let values = [69];
</script>

<RangeSlider bind:value />
<pre class="astro-code"><code>bind:value</code> ( <code>{value}</code> )</pre>
<RangeSlider bind:values />
<pre class="astro-code"><code>bind:values={'{values}'}</code> ( <code>{values}</code> )</pre>