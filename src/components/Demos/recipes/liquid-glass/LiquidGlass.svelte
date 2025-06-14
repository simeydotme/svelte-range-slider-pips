<script>
  import { onMount } from 'svelte';
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './LiquidGlass.css?inline';

  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */

  let slider;
  let classes = '';
  let timer;
  let isDarkMode = false;
  /* hide */
  const backgrounds = ['--bg-0', '--bg-1', '--bg-2', '--bg-3', '--bg-4', '--bg-5'];
  let whichBackground = Math.floor(Math.random() * (backgrounds.length - 1)) + 1;
  /* endhide */


  /* hide */
  const setBackground = () => {
    document.querySelector('.slider-container:has(#liquid-glass-slider)').style.setProperty('--bg-image', `var(${backgrounds[whichBackground]})`);
  }

  const activateHandles = () => {
    slider.querySelectorAll('.rangeHandle').forEach(handle => handle.classList.add('rsActive'));
  }

  const nextBackground = () => {
    whichBackground = (whichBackground + 1) % backgrounds.length;
    setBackground();
    activateHandles();
  }

  const toggleBrightness = () => {
    activateHandles();
  }

  /* endhide */

  /** 
   * when the slider handle moves, check if it's increasing or decreasing and
   * add the appropriate class to the slider (we use css to animate the floating labels)
  */
  const change = (e) => {
    const delta = -(e.detail.previousValue - e.detail.value);
    if ( delta > 0 ) { classes = 'up';} 
    else { classes = 'down'; }
    clearTimeout( timer );
    // end the animation when movement stops
    timer = setTimeout( stop, 66 );
  }

  const stop = () => classes = '';

  /* hide */
  onMount(() => {
    setBackground();
    activateHandles();
  })
  /* endhide */
</script>

<RangeSlider 
  bind:slider
  id="liquid-glass-slider"
  class={classes}
  darkmode={isDarkMode ? 'force' : false}
  values={[30,70]}
  range
  pushy
  rangeGapMin={20}
  on:change={change}
  on:stop={stop}
/>

<!-- hide -->
<div class="controls">
  <button type="button" on:click={nextBackground}>Next Background</button>
  <label><input type="checkbox" bind:checked={isDarkMode} id="dark-mode-toggle" on:change={toggleBrightness} /> Darker</label>
</div>

<style>
  .controls {

    --labels: white;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    margin-inline: auto;
    background: var(--fg);
    border-radius: 0.75rem;
    padding: 2rem;

  }

  @media (max-width: 500px) {
    .controls {
      flex-direction: column;
      gap: 1rem;
    }
  }

  .controls label {
    margin: 0;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  :global(.theme-dark .controls) {
    --labels: black!important;
  }

  :global(.slider-container legend) {
    color: white;
  }
  
</style>
<!-- endhide -->

<!-- hide -->
{@html renderCss}
<!-- endhide -->