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

  /**
   * maintain a distance of 1 between the handles when
   * the user is dragging the handle
   */
  const slide = ({ detail }) => {
    if (detail.activeHandle === 0 && values[1] < detail.value + 1) {
      values[1] = detail.value + 1;
    }
    if (detail.activeHandle === 1 && values[0] > detail.value - 1) {
      values[0] = detail.value - 1;
    }
  };

  /**
   * enforce the gap between the handles when the user
   * stops dragging the handle
   */
  const stop = ({ detail }) => {
    if (detail.activeHandle === 0 && detail.value >= 10) {
      values[0] = 10;
    }
    if (detail.activeHandle === 1 && detail.value <= 0) {
      values[1] = 1;
    }
  };
</script>

<RangeSlider
  id="label"
  bind:values
  float
  pips
  first="label"
  last="label"
  range
  max={11}
  {formatter}
  on:change={slide}
  on:stop={stop}
/>


<!-- hide -->
{@html renderCss}
<!-- endhide -->
