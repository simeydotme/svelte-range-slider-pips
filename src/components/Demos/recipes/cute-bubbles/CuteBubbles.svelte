<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './CuteBubbles.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
  let sliderValues = [15, 35];
  let max = 50;
</script>

<div id="cute-sliders">
  <RangeSlider class="cute" range bind:values={sliderValues} pips pipstep={1} {max} float />
  
  <div class="flex">
    <RangeSlider class="cute" value={10} pips pipstep={1} max={30} vertical float range="min" />
    <RangeSlider class="cute" value={15} pips pipstep={1} max={30} vertical float />
    <RangeSlider class="cute" value={20} pips pipstep={1} max={30} vertical float range="max" />
  </div>
</div>


<!-- hide -->
{@html renderCss}
<!-- endhide -->