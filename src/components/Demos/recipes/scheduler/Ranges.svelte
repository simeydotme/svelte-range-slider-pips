<script>
  import { onMount } from 'svelte';
  import RangeSlider from 'svelte-range-slider-pips';
  import pipsCss from './Basic.css?inline';
  import handleCss from './HandleBasic.css?inline'; 
  import rangesCss from './Ranges.css?inline';

  /* hide */
  const renderCss = `<style>${pipsCss} ${handleCss} ${rangesCss}</style>`;
  /* endhide */

  // set up the slider's state
  let slider;
  const max = 24;
  let values = [4.75, 6.5, 19, 21];
  let rangeStyle = '';
  let pipsStyle = '';

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
          #ranges.rangeSlider .rangePips .rsPip[data-val="${pipValue}"] {
            background-color: var(--pip-active);
            color: var(--pip-active-text);
            font-weight: 600;
          }
        `;
      }
    });
  }

  /**
   * update the range styles when the component mounts
   */
  onMount(() => {
    updateRangeStyle({ detail: { values } });
  });
</script>

<RangeSlider 
  id="ranges"
  bind:slider
  bind:values
  class="scheduler handle ranges"
  style={rangeStyle}
  step={0.25}
  max={max}
  pips
  all="label"
  on:change={updateRangeStyle}
/>

<button type="button" on:click|once={() => {
  values = ([...values, 9, 12]).sort((a, b) => a - b);
  updateRangeStyle({ detail: { values } });
}}>
  Add a range
</button>

<!-- Render the pips styles for pips in ranges -->
{@html `<style>${pipsStyle}</style>`}

<!-- hide -->
{@html renderCss}
<!-- endhide -->