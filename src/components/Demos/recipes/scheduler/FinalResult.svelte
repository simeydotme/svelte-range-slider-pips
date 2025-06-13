<script>
  import { onMount } from "svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import pipsCss from "./Basic.css?inline";
  import handleCss from "./HandleBasic.css?inline";
  import rangesCss from "./Ranges.css?inline";
  import bindingCss from "./BindingAndFloats.css?inline";
  import jazzedUpCss from "./JazzedUp.css?inline";
  import finalCss from "./FinalResult.css?inline";

  /* hide */
  const renderCss = `<style>${pipsCss} ${handleCss} ${rangesCss} ${bindingCss} ${jazzedUpCss} ${finalCss}</style>`;
  /* endhide */

  // set up the slider's state
  let slider;
  const min = 0;
  const max = 24;
  let values = [4.75, 6.5, 19, 21];
  let rangeStyle = "";
  let pipsStyle = "";

  const minRangeSize = 1; // minimum distance between handles in the same range
  const minRangeGap = 0.5; // minimum distance between the two ranges

  /**
   * get the range gradient stops for each range pair
   */
  const getRangeStop = (range) => {
    const rangePercents = range.map((v) => (v / max) * 100);
    return `
      transparent ${rangePercents[0]}%, 
      var(--slider-accent) ${rangePercents[0]}%, 
      var(--slider-accent) ${rangePercents[1]}%, 
      transparent ${rangePercents[1]}%
    `;
  };

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
    const rangeStops = ranges.map(getRangeStop).join(",");
    // set the range style
    rangeStyle = `background-image: linear-gradient(to right, transparent, ${rangeStops}, transparent);`;
    setPipsInRange(ranges);
  };

  /**
   * apply a css style for each pip that is in a range,
   * we can't use `style=` here like the gradient, because the style is
   * applied to the slider parent, not the pips
   */
  const setPipsInRange = (ranges) => {
    pipsStyle = "";
    const pips = slider.querySelectorAll(".rsPip");
    pips.forEach((pip, i) => {
      const pipValue = parseFloat(pip.dataset.val);
      if (ranges.some((range) => pipValue >= range[0] && pipValue <= range[1])) {
        pipsStyle += `
          #final.rangeSlider .rangePips .rsPip[data-val="${pipValue}"] {
            background-color: var(--pip-active);
            color: var(--pip-active-text);
            font-weight: 600;
          }
        `;
      }
    });
  };

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
        const isRangeBoundary = prev % 2 === 1; // odd index means we're at the start of a range
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
        const isRangeBoundary = next % 2 === 0; // even index means we're at the end of a range
        const requiredDistance = isRangeBoundary ? minRangeGap : minRangeSize;

        // if the previous handle is too close to the next handle, move the next handle forward
        if (values[next - 1] > values[next] - requiredDistance) {
          values[next] = Math.min(max, values[next - 1] + requiredDistance);
        }
      }
    }

    // prevent the handles from pushing past other handles
    handleStop(e);

    // update the gradient positions
    updateRangeStyle({ detail: { values } });
  };

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
        const isRangeBoundary = next % 2 === 0; // even index means we're at the end of a range
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
        const isRangeBoundary = prev % 2 === 1; // odd index means we're at the start of a range
        const requiredDistance = isRangeBoundary ? minRangeGap : minRangeSize;
        // if the previous handle is too close to the next handle, move the next handle back
        if (values[prev] > values[prev + 1] - requiredDistance) {
          values[prev] = values[prev + 1] - requiredDistance;
        }
      }
    }
  };

  /**
   * format the handle floats in to a 24hr time format
   */
  const decimalToTimeString = (v) => {
    const time = new Date();
    time.setHours(Math.floor(v));
    time.setMinutes(Math.round((v - Math.floor(v)) * 60));
    return new Intl.DateTimeFormat("en", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(time);
  };

  /**
   * convert a time string to a decimal value
   */
  const timeStringToDecimal = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours + minutes / 60;
  };

  /**
   * convert a time string to a percentage value
   */
  const timeStringToPercent = (timeStr) => {
    const decimal = timeStringToDecimal(timeStr);
    return parseFloat((((decimal - min) / (max - min)) * 100).toFixed(2));
  };

  /**
   * set the sunrise and sunset styles, this would probably be gotten from
   * a server/api based on lat/long in reality.
   */
  const sunrise = "05:33";
  const sunset = "20:41";
  const sunStyle = `--sunrise: ${timeStringToPercent(sunrise)}%; --sunset: ${timeStringToPercent(sunset)}%;`;

  /**
   * create a derived array of the ranges as percentage pairs
   * this is used to show the 'remove range' buttons on the center of each range
   */
  $: rangePercentsArray = Array.from({ length: values.length / 2 }, (_, i) =>
    values.map((v) => (v / max) * 100).slice(i * 2, i * 2 + 2)
  );

  /**
   * create a derived array of the gaps between the ranges as percentage pairs
   * this is used to show the 'add range' buttons between each range
   */
  $: rangeGapsPercentsArray = (() => {
    const gaps = [];
    for (let i = 0; i <= rangePercentsArray.length; i++) {
      const gap =
        i === 0
          ? [0, rangePercentsArray[0][0]]
          : i === rangePercentsArray.length
            ? [rangePercentsArray[i - 1][1], 100]
            : [rangePercentsArray[i - 1][1], rangePercentsArray[i][0]];

      // don't include the edges if the range starts/ends at the edges
      if (!(gap[0] === 0 && gap[1] === 0) && !(gap[0] === 100 && gap[1] === 100)) {
        gaps.push(gap);
      }
    }
    return gaps;
  })();

  /**
   * delete a range from the values array, this is done by finding the index of the range
   * and then removing the range from the values array
   */
  const deleteRange = (range) => {
    const index = rangePercentsArray.findIndex((r) => r[0] === range[0] && r[1] === range[1]);
    values.splice(index * 2, 2);
    values = [...values];
    
    // update the gradient positions
    updateRangeStyle({ detail: { values } });
  };

  /**
   * add a range to the values array, this is done by finding the gap between the ranges
   * and then adding the gap values to the values array
   *
   * we then find the index of the first handle in the gap and set it as the active handle
   * this is done to prevent the handles from pushing past other handles
   */
  const addRange = (gap) => {
    const index = rangeGapsPercentsArray.findIndex((g) => g[0] === gap[0] && g[1] === gap[1]);
    const gapValues = [(gap[0] * (max - min) + min) / 100 + 0.5, (gap[1] * (max - min) + min) / 100 - 0.5];
    values = [...values, ...gapValues].sort((a, b) => a - b);
    
    // reposition handles if needed, and update the gradient positions
    const firstHandleIndex = values.findIndex((v) => v === gapValues[0]);
    handleChange({ detail: { values, activeHandle: firstHandleIndex, value: values[firstHandleIndex] } });
  };

  /**
   * update the range styles when the component mounts
   */
  onMount(() => {
    updateRangeStyle({ detail: { values } });
  });
</script>





<!-- start the HTML/Svelte code -->

<div class="slider-wrapper" style={`${sunStyle}`}>

  <span class="sunrise" title="sunrise time: {sunrise}">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sunset-2" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 13h1" /><path d="M20 13h1" /><path   d="M5.6 6.6l.7 .7" /><path d="M18.4 6.6l-.7 .7" /><path d="M8 13a4 4 0 1 1 8 0" /><path d="M3 17h18" /><path d="M7 20h5" /><path   d="M16 20h1" /><path d="M12 5v-1" /></svg>
  </span>

  <span class="sunset" title="sunset time: {sunset}">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-haze-moon" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 16h18" /><path d="M3 20h18" /><path   d="M8.296 16c-2.268 -1.4 -3.598 -4.087 -3.237 -6.916c.443 -3.48 3.308 -6.083 6.698 -6.084v.006h.296c-1.991 1.916 -2.377 5.03 -.918 7.405c1.459 2.374 4.346 3.33 6.865 2.275a6.888 6.888 0 0 1 -2.777 3.314" /></svg>
  </span>

  <RangeSlider
    bind:slider
    bind:values
    id="final"
    class="scheduler handle ranges bindings jazzed final"
    style={`${rangeStyle}`}
    step={0.25}
    {min}
    {max}
    pips
    all="label"
    float
    handleFormatter={decimalToTimeString}
    on:change={handleChange}
  />

  <div class="slider-actions">
    <!-- buttons to remove each range, placed on the center of each range -->

    {#if values.length > 2}
      {#each rangePercentsArray as range}
        <button
          type="button"
          title="remove range"
          style={`left: ${(range[0] + range[1]) / 2}%`}
          on:click={() => {
            deleteRange(range);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-square-x" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path   d="M19 2h-14a3 3 0 0 0 -3 3v14a3 3 0 0 0 3 3h14a3 3 0 0 0 3 -3v-14a3 3 0 0 0 -3 -3zm-9.387 6.21l.094 .083l2.293 2.292l2.293 -2.292a1 1 0 0 1 1.497 1.32l-.083 .094l-2.292 2.293l2.292 2.293a1 1 0 0 1 -1.32 1.497l-.094 -.083l-2.293 -2.292l-2.293 2.292a1 1 0 0 1 -1.497 -1.32l.083 -.094l2.292 -2.293l-2.292 -2.293a1 1 0 0 1 1.32 -1.497z" /></svg>
        </button>
      {/each}
    {/if}

    <!-- buttons to add a range, placed between each existing range -->

    {#if values.length < 16}
      {#each rangeGapsPercentsArray as gap}
        <button
          type="button"
          title="add range"
          style={`left: ${(gap[0] + gap[1]) / 2}%`}
          on:click={() => {
            addRange(gap);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="icon icon-tabler icons-tabler-filled icon-tabler-circle-plus" ><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path   d="M4.929 4.929a10 10 0 1 1 14.141 14.141a10 10 0 0 1 -14.14 -14.14zm8.071 4.071a1 1 0 1 0 -2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0 -2h-2v-2z" /></svg>
        </button>
      {/each}
    {/if}

  </div>

</div>

<!-- Render the pips styles for pips in ranges -->
{@html `<style>${pipsStyle}</style>`}

<!-- hide -->
{@html renderCss}
<!-- endhide -->
