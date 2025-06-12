<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './OddOnly.css?inline';

  const renderCss = `<style>${css}</style>`;
</script>

<RangeSlider id="odd-only" pips all="label" max={20} />

<!-- hide -->
{@html renderCss}
<!-- endhide -->