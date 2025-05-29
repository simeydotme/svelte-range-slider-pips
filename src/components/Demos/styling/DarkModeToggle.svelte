<script hide>
  import RangeSlider from 'svelte-range-slider-pips';
  import DarkModeToggleCss from './DarkModeToggle.css';
</script>

<RangeSlider id="toggled" darkmode="auto" 
  pips first="label" last="label" range='max' valus={50} limits={[25,100]} />

<p hide>Toggle the website theme in the sidebar to see this in action.</p>