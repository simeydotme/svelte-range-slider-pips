<script>
  import RangeSlider from "svelte-range-slider-pips";
  import css from './MonthPicker.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
  let values = [2, 9];
  let dateFormat = new Intl.DateTimeFormat("en", { month: "short" });

  const formatter = (v, i, p) => {
    return dateFormat.format(new Date(new Date().getFullYear(), v, 1));
  };

</script>

<RangeSlider
  id="month-picker"
  bind:values
  float
  pips
  first="label"
  last="label"
  range
  max={11}
  {formatter}
  rangeGapMin={1}
  pushy
  draggy
/>


<!-- hide -->
{@html renderCss}
<!-- endhide -->
