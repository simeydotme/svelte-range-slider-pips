<script>

  import RangeSlider from 'svelte-range-slider-pips';
  import css from './PriceGradient.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
  
  let slider;
  let timer;
  let values = [ 2333, 7878 ];

  const currency = new Intl.NumberFormat( "en", { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const formatter = (value) => currency.format(value);

  const stop = () => {
    slider.classList.remove( "up", "down" );
  }

  const slide = (e) => {
    const delta = -(e.detail.previousValue - e.detail.value);
    if ( delta > 0 ) {
      slider.classList.add( "up" );
      slider.classList.remove( "down" );
    } else {
      slider.classList.add( "down" );
      slider.classList.remove( "up" );
    }
    clearTimeout( timer );
    timer = setTimeout( stop, 66 );
  }

</script>

<RangeSlider 
  id="PriceGradient" 
  bind:slider
  bind:values
  range
  float
  pips
  first={false}
  last={false}
  min={0}
  max={10000}
  step={1}
  pipstep={200}
  {formatter}
  on:change={slide}
  on:stop={stop} 
/>

<!-- hide -->
{@html renderCss}
<!-- endhide -->
