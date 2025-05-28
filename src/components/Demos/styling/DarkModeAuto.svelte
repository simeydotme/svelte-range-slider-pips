<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
</script>

<RangeSlider darkmode="auto" pips first="label" last="label" range='max' valus={50} limits={[25,100]} />

<p hide>Change the browser <code>prefers-color-scheme</code> to see the dark mode in action.</p>