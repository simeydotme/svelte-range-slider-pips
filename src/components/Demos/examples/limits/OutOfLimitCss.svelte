<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import './OutOfLimitsCss.css';
  let values = [40,60];
</script>

<RangeSlider id="sliderLimits" limits={[20,80]} range pips draggy bind:values />


<code data-values title="The output slider values">{values}</code>