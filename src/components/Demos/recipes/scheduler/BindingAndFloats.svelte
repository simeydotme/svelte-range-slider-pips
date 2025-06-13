<script>
  import { onMount } from 'svelte';
  import RangeSlider from 'svelte-range-slider-pips';
  import pipsCss from './Basic.css?inline';
  import handleCss from './HandleBasic.css?inline'; 
  import rangesCss from './Ranges.css?inline';
  import bindingCss from './BindingAndFloats.css?inline';

  /* hide */
  const renderCss = `<style>${pipsCss} ${handleCss} ${rangesCss} ${bindingCss}</style>`;
  /* endhide */

  // set up the slider's state
  let slider;
  const min = 0;
  const max = 24;
  let values = [4.75, 6.5, 19, 21];
  let rangeStyle = '';
  let pipsStyle = '';
  
  const minRangeSize = 1;  // minimum distance between handles in the same range
  const minRangeGap = 0.5;  // minimum distance between the two ranges

  /**
   * get the range gradient stops for each range pair
   */
  const getRangeStop = (range) => {
    const rangePercents = range.map(v => v / max * 100);
    return `
      transparent ${rangePercents[0]}%, 
      var(--slider-accent) ${rangePercents[0]}%, 
      var(--slider-accent) ${rangePercents[1]}%, 
      transparent ${rangePercents[1]}%
    `;
  }

  /**
   * update the range style when the slider values change
   * so that we can show the ranges as a gradient
   */
  const updateRangeStyle = (e) => {
    const { values } = e.detail;
    const l = values.length;
    // chunk the array into range pairs
    const ranges = Array.from({ length: l / 2 }, (_, i) => values.slice(i * 2, i * 2 + 2));
    // get the range gradient stops for each range pair
    const rangeStops = ranges.map(getRangeStop).join(',');
    // set the range style
    rangeStyle = `background-image: linear-gradient(to right, transparent, ${rangeStops}, transparent);`;
    setPipsInRange(ranges);
  }

  /**
   * apply a css style for each pip that is in a range,
   * we can't use `style=` here like the gradient, because the style is 
   * applied to the slider parent, not the pips
   */
  const setPipsInRange = (ranges) => {
    pipsStyle = '';
    const pips = slider.querySelectorAll('.rsPip');
    pips.forEach((pip, i) => {
      const pipValue = parseFloat(pip.dataset.val);
      if ( ranges.some(range => pipValue >= range[0] && pipValue <= range[1]) ) {
        pipsStyle += `
          #binding.rangeSlider .rangePips .rsPip[data-val="${pipValue}"] {
            background-color: var(--pip-active);
            color: var(--pip-active-text);
            font-weight: 600;
          }
        `;
      }
    });
  }

  
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

    updateRangeStyle({ detail: { values } });
    handleStop(e);
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

    updateRangeStyle({ detail: { values } });
  }

  /**
   * format the handle floats in to a 24hr time format
   */
  const handleFormatter = (v) => {
    const time = new Date();
    time.setHours(Math.floor(v));
    time.setMinutes(Math.round((v - Math.floor(v)) * 60));
    return new Intl.DateTimeFormat('en', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(time);
  }

  /**
   * update the range styles when the component mounts
   */
  onMount(() => {
    updateRangeStyle({ detail: { values } });
  });
</script>

<RangeSlider 
  bind:slider
  bind:values
  id="binding"
  class="scheduler handle ranges bindings"
  style={rangeStyle}
  step={0.25}
  {min}
  {max}
  pips
  all="label"
  float
  handleFormatter={handleFormatter}
  on:change={handleChange}
  on:stop={handleStop}
/>

<section id="inputs">
  {#each Array.from({ length: values.length / 2 }, (_, i) => values.slice(i * 2, i * 2 + 2)) as range, i}
    
    <input type="time" min="0:00" max="24:00" value={handleFormatter(values[i * 2])} readonly />
    <span> - </span>
    <input type="time" min="0:00" max="24:00" value={handleFormatter(values[i * 2 + 1])} readonly />
  {/each}
  <button type="button" on:click={() => {
    values = [...values, 9, 12].sort((a, b) => a - b);
    updateRangeStyle({ detail: { values } });
  }}>
    Add a time range
  </button>
</section>

<style>
  #inputs {
    display: grid;
    grid-template-columns: 1fr max-content 1fr;
    gap: 1em;
    place-items: center;
    max-width: 300px;
    margin: 5rem auto 0;
  }

  #inputs input {
    width: 100%;
  }

  #inputs button {
    grid-column: span 3;
  }
</style>

<!-- Render the pips styles for pips in ranges -->
{@html `<style>${pipsStyle}</style>`}

<!-- hide -->
{@html renderCss}
<!-- endhide -->