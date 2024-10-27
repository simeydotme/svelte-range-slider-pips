<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [10,50,90]; // 3 handles
  let crazy = [10,20,30,40,50,60,70,80,90]; // crazy number of handles
</script>

<RangeSlider bind:values />
<!-- hide --><pre class="astro-code"><!-- endhide -->[{values}]
<!-- hide --></pre><!-- endhide -->

<RangeSlider bind:values={crazy} /><!-- hide --><pre class="astro-code"><!-- endhide -->[{crazy}]
<!-- hide -->but why?</pre><!-- endhide -->