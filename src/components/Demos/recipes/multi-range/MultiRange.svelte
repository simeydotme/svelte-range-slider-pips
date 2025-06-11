<script>
  import RangeSlider from 'svelte-range-slider-pips';
  import css from './MultiRange.css?inline';

  /* hide */
  export let isToggle = true;
  const renderCss = `<style>${css}</style>`;
  let id = 'multi-range';
  /* endhide */
  const min = 0;
  const max = 10000;
  let values = [2000, 4000, 6000, 8000]; // this is basically two ranges, 2000-4000 and 6000-8000
  const minRangeSize = 1000;  // minimum distance between handles in the same range
  const minRangeGap = 500;  // minimum distance between the two ranges
  
  // get the percentages for each handle
  $: percentages = values.map(value => ((value - min) / (max - min)) * 100);
  // set a css variable for each handle (ie; --r1: 10%;)
  $: style = `${percentages.map((p, i) => `--r${i+1}: ${p}%`).join('; ')}`;

  /**
   * this is the main function that handles the change of the slider
   * it checks if the current handle is too close to the previous or next handle
   * and if so, it moves the previous or next handle to 
   * maintain the minRangeSize and minRangeGap
   */
  const handleChange = (e) => {
    const thisHandle = e.detail.activeHandle;
    const currentValue = e.detail.value;
    const handleValues = e.detail.values;
    const lastHandle = handleValues.length - 1;
    
    // If moving left and would violate minimum distance
    if (thisHandle > 0 && currentValue < handleValues[thisHandle - 1] + minRangeSize) {
      // Start from the current handle and propagate left
      values[thisHandle] = currentValue;
      for (let prev = thisHandle - 1; prev >= 0; prev--) {
        // Check if we're crossing a range boundary (between even and odd handles)
        const isRangeBoundary = prev % 2 === 1;  // odd index means we're at the start of a range
        const requiredDistance = isRangeBoundary ? minRangeGap : minRangeSize;
        // if the next handle is too close to the previous handle, move the previous handle back
        if (values[prev + 1] < values[prev] + requiredDistance) {
          values[prev] = Math.max(min, values[prev + 1] - requiredDistance);
        }
      }
    }
    
    // If moving right and would violate minimum distance
    if (thisHandle < lastHandle && currentValue > handleValues[thisHandle + 1] - minRangeSize) {
      // Start from the current handle and propagate right
      values[thisHandle] = currentValue;
      for (let next = thisHandle + 1; next < handleValues.length; next++) {
        // Check if we're crossing a range boundary (between even and odd handles)
        const isRangeBoundary = next % 2 === 0;  // even index means we're at the end of a range
        const requiredDistance = isRangeBoundary ? minRangeGap : minRangeSize;
        
        // if the previous handle is too close to the next handle, move the next handle forward
        if (values[next - 1] > values[next] - requiredDistance) {
          values[next] = Math.min(max, values[next - 1] + requiredDistance);
        }
      }
    }

    // uncomment this to remove the 'rubber banding' effect
    // handleStop(e);
  }

  /**
   * we check if the first or last handle is at the min or max value
   * and if so, we move the other handles to the left or right to maintain 
   * the minRangeSize and minRangeGap
   * 
   * this is done on:stop to improve the performance a little bit, but it could
   * be done on:change as well to stop the 'rubber banding' effect
   */
  const handleStop = (e) => {
    const handleValues = e.detail.values;
    const lastHandle = handleValues.length - 1;

    // if first handle is at min, ensure all handles to the right maintain distance
    if (values[0] <= min) {
      values[0] = min;
      for (let next = 1; next < values.length; next++) {
        const isRangeBoundary = next % 2 === 0;  // even index means we're at the end of a range
        const requiredDistance = isRangeBoundary ? minRangeGap : minRangeSize;
        // if the next handle is too close to the previous handle, move the previous handle forward
        if (values[next] < values[next - 1] + requiredDistance) {
          values[next] = values[next - 1] + requiredDistance;
        }
      }
    }
    
    // if last handle is at max, ensure all handles to the left maintain distance
    if (values[lastHandle] >= max) {
      values[lastHandle] = max;
      for (let prev = values.length - 2; prev >= 0; prev--) {
        const isRangeBoundary = prev % 2 === 1;  // odd index means we're at the start of a range
        const requiredDistance = isRangeBoundary ? minRangeGap : minRangeSize;
        // if the previous handle is too close to the next handle, move the next handle back
        if (values[prev] > values[prev + 1] - requiredDistance) {
          values[prev] = values[prev + 1] - requiredDistance;
        }
      }
    }
  }

  const toggleId = () => {
    id = id === 'multi-range' ? '' : 'multi-range';
  }
</script>

<RangeSlider
  {id}
  bind:values
  {min}
  {max}
  {style}
  pips
  first="label"
  last="label"
  float
  on:change={handleChange}
  on:stop={handleStop}
  darkmode="auto"
/>


<!-- hide -->
{#if isToggle}
<!-- endhide -->

<button type="button" on:click={toggleId}>
  Toggle Styling
</button>

<!-- hide -->
{/if}
<!-- endhide -->


<code data-values title="The output slider values">{values}</code>

<!-- hide -->
{@html renderCss}
<!-- endhide -->