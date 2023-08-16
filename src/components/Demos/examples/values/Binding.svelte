<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [11];
  let myValues = [69];
</script>

<RangeSlider bind:values />
<pre><code>bind:values</code> ( <code>{values}</code> )</pre>
<RangeSlider bind:values={myValues} />
<pre><code>bind:values={'{myValues}'}</code> ( <code>{myValues}</code> )</pre>