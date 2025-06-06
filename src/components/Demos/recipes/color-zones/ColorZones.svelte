<script>
  import { tick } from 'svelte';
  import { fade } from 'svelte/transition';
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './ColorZones.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let sliderValue = 50;

  // set some arbitrary values for safe/unsafe
  const unsafePct = 20;
  const safePct = 80;

  // a variable for containing the class name of the slider
  let sliderClass = '';

  // update the class name of the slider based on the value
  const updateZones = ({ detail }) => {
    // extract the value from the event
    const {value} = detail;
    // set the slider as 'safe' or 'unsafe' based on the value
    if ( value <= unsafePct ) {
      sliderClass = 'unsafe';
    } else if ( value >= safePct ) {
      sliderClass = 'safe';
    } else {
      sliderClass = '';
    }
  }

  // after slider stops moving, check if it's in the unsafe zone
  // and if so, move it out of the unsafe zone
  const checkZones = async({ detail }) => {
    // extract the value from the event
    const {value} = detail;
    // set the slider as 'safe' or 'unsafe' based on the value
    if ( value < unsafePct ) {
      // wait for the next tick to update the value
      await tick();
      // reset the slider to the not-unsafe zone
      sliderValue = unsafePct + 1;
      updateZones({ detail: { value: sliderValue } });
    }
  }
</script>

<div class="color-zones {sliderClass}">

  <h3>Reactor Operating Efficiency</h3>
  <RangeSlider id="two-zones" class={sliderClass} range bind:value={sliderValue} on:change={updateZones} on:stop={checkZones} float suffix="%" />

  {#if sliderValue <= unsafePct}
    <p transition:fade><strong>Warning:</strong> cannot operate below {unsafePct}%!</p>
  {:else if sliderValue >= safePct}
    <p transition:fade>Reactor operating safely at {sliderValue}%!</p>
  {/if}

</div>


<!-- hide -->
{@html renderCss}
<!-- endhide -->