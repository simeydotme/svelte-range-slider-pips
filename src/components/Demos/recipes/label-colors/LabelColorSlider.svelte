<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './LabelColorSlider.css?inline';
  /* hide */
  const renderCss = `<style>${css}</style>`;
  /* endhide */
  export let hue = 0;
  export let isOpen = false;
</script>

<div class="label-slider-container" class:isOpen>
  <RangeSlider
    class="label-slider"
    bind:value={hue}
    pips
    all={false}
    rest="pips"
    pipstep={20}
    min={0}
    max={320}
    float
    handleFormatter={() => `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2q-.327 0-.642.005l-.616.017l-.299.013l-.579.034l-.553.046c-4.785.464-6.732 2.411-7.196 7.196l-.046.553l-.034.579q-.008.147-.013.299l-.017.616l-.004.318L2 12q0 .327.005.642l.017.616l.013.299l.034.579l.046.553c.464 4.785 2.411 6.732 7.196 7.196l.553.046l.579.034q.147.008.299.013l.616.017L12 22l.642-.005l.616-.017l.299-.013l.579-.034l.553-.046c4.785-.464 6.732-2.411 7.196-7.196l.046-.553l.034-.579q.008-.147.013-.299l.017-.616L22 12l-.005-.642l-.017-.616l-.013-.299l-.034-.579l-.046-.553c-.464-4.785-2.411-6.732-7.196-7.196l-.553-.046l-.579-.034l-.299-.013l-.616-.017l-.318-.004z"/></svg>
    `}
  />
</div>

<!-- hide -->
{@html renderCss}
<!-- endhide -->