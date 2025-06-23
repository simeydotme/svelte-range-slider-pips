<script>

  import RangeSlider from 'svelte-range-slider-pips';
  import css from './TemperatureSlider.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let baseValue = 10;
  let value = baseValue;
  let min = -20;
  let max = 50;
  let scale = 'c';
  const conversion = (v) => (scale === 'c' ? v : (v * 9) / 5 + 32);
  const toggleScale = () => { scale = scale === 'c' ? 'f' : 'c'; };

  /* set a hot/cold class for the range based on the value */
  $: rangeClass = `range${value < baseValue ? 'cold' : value > baseValue ? 'hot' : ''}`;
  /* set the split point for the range gradient */
  $: style = `--split: ${parseFloat((100 / (max - min)) * (value + 20)).toFixed(2)}%;`;

  /* icons for the labels */
  const iconC = '<svg viewBox="0 0 24 24" class="icon icon-tabler icons-tabler-outline icon-tabler-temperature-celsius"><path stroke="none" d="M0 0h24v24H0z"  /><path d="M6 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M20 9a3 3 0 0 0 -3 -3h-1a3 3 0 0 0 -3 3v6a3 3 0 0 0 3 3h1a3 3 0 0 0 3 -3" /></svg>';
  const iconF = '<svg viewBox="0 0 24 24" class="icon icon-tabler icons-tabler-outline icon-tabler-temperature-fahrenheit"><path stroke="none" d="M0 0h24v24H0z"  /><path d="M6 8m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M13 12l5 0" /><path d="M20 6h-6a1 1 0 0 0 -1 1v11" /></svg>';
  const iconHot = '<svg viewBox="0 0 24 24" class="icon icon-tabler icons-tabler-outline icon-tabler-temperature-sun"><path stroke="none" d="M0 0h24v24H0z"  /><path d="M4 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 1 0 -4 0v8.5" /><path d="M4 9h4" /><path d="M13 16a4 4 0 1 0 0 -8a4.07 4.07 0 0 0 -1 .124" /><path d="M13 3v1" /><path d="M21 12h1" /><path d="M13 20v1" /><path d="M19.4 5.6l-.7 .7" /><path d="M18.7 17.7l.7 .7" /></svg>';
  const iconCold = '<svg viewBox="0 0 24 24" class="icon icon-tabler icons-tabler-outline icon-tabler-temperature-snow"><path stroke="none" d="M0 0h24v24H0z"  /><path d="M4 13.5a4 4 0 1 0 4 0v-8.5a2 2 0 1 0 -4 0v8.5" /><path d="M4 9h4" /><path d="M14.75 4l1 2h2.25" /><path d="M17 4l-3 5l2 3" /><path d="M20.25 10l-1.25 2l1.25 2" /><path d="M22 12h-6l-2 3" /><path d="M18 18h-2.25l-1 2" /><path d="M17 20l-3 -5h-1" /><path d="M12 9l2.088 .008" /></svg>';

</script>

<RangeSlider
  id="rangeTemp"
  class={rangeClass}
  {style}
  bind:value
  {min}
  {max}
  pips
  float
  step={0.1}
  pipstep={10}
  all={false}
  first="label"
  last="label"
  formatter={(v) => v <= min ? iconCold : v >= max ? iconHot : '' }
  handleFormatter={(v) => conversion(v).toFixed(1) + (scale === 'c' ? iconC : iconF)}
/>

<button
  class="tempSwitch"
  type="button"
  title="Toggle temperature between Celsius and Fahrenheit"
  on:click={toggleScale}
>
  {@html scale === 'c' ? iconF : iconC}
</button>

<!-- hide -->
{@html renderCss}
<!-- endhide -->
