<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './DarkModeToggle.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
</script>

<RangeSlider id="toggled" darkmode="auto" 
  pips first="label" last="label" range='max' valus={50} limits={[25,100]} />

<p hide>Toggle the website theme in the sidebar to see this in action.</p>

<!-- hide -->
{@html renderCss}
<!-- endhide -->