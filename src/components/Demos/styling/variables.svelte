<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  import { hexToHSL, hexToHSLString } from '~lib/hex2hsl'

  let clrSlider = "#d7dada";
  let clrHandleInactive = "#99a2a2";
  let clrHandle = "#838de7";
  let clrHandleFocus = "#4a40d4";
  let clrHandleBorder = "#838de7";
  let clrRangeInactive = "#99a2a2";
  let clrRange = "#4a40d4";
  let clrFloatInactive = "#99a2a2";
  let clrFloat = "#4a40d4";
  let clrFloatText = "#ffffff";

  let clrPip = "#778899";
  let clrPipText = "#778899";
  let clrPipActive = "#2f4f4f";
  let clrPipActiveText = "#2f4f4f";
  let clrPipHover = "#2f4f4f";
  let clrPipHoverText = "#2f4f4f";
  let clrPipInRange = "#2f4f4f";
  let clrPipInRangeText = "#2f4f4f";

  $: variablesStyle = 
`<style>
  :root {
    --range-slider:            ${hexToHSLString(clrSlider)};
    --range-handle-inactive:   ${hexToHSLString(clrHandleInactive)};
    --range-handle:            ${hexToHSLString(clrHandle)};
    --range-handle-focus:      ${hexToHSLString(clrHandleFocus)};
    --range-handle-border:     ${hexToHSLString(clrHandleBorder)};
    --range-range-inactive:    ${hexToHSLString(clrRangeInactive)};
    --range-range:             ${hexToHSLString(clrRange)};
    --range-float-inactive:    ${hexToHSLString(clrFloatInactive)};
    --range-float:             ${hexToHSLString(clrFloat)};
    --range-float-text:        ${hexToHSLString(clrFloatText)};

    --range-pip:               ${hexToHSLString(clrPip)};
    --range-pip-text:          ${hexToHSLString(clrPipText)};
    --range-pip-active:        ${hexToHSLString(clrPipActive)};
    --range-pip-active-text:   ${hexToHSLString(clrPipActiveText)};
    --range-pip-hover:         ${hexToHSLString(clrPipHover)};
    --range-pip-hover-text:    ${hexToHSLString(clrPipHoverText)};
    --range-pip-in-range:      ${hexToHSLString(clrPipInRange)};
    --range-pip-in-range-text: ${hexToHSLString(clrPipInRangeText)};
  }
</style>`

</script>


<div class="variables">

  <RangeSlider min={0} max={100} values={[70]} step={10} pipstep={2} range="min" pips first={false} rest="label" last="label" float />

  <div class="inputs">
    <span>Slider Range</span>
    <input type="color" name="clrSlider" id="clrSlider" bind:value={clrSlider} title="--range-slider">
    <input type="color" name="clrRangeInactive" id="clrRangeInactive" bind:value={clrRangeInactive} title="--range-range-inactive">
    <input type="color" name="clrRange" id="clrRange" bind:value={clrRange} title="--range-range">
  </div>

  <div class="inputs">
    <span>Handles</span>
    <input type="color" name="clrHandleInactive" id="clrHandleInactive" bind:value={clrHandleInactive} title="--range-handle-inactive">
    <input type="color" name="clrHandle" id="clrHandle" bind:value={clrHandle} title="--range-handle">
    <input type="color" name="clrHandleFocus" id="clrHandleFocus" bind:value={clrHandleFocus} title="--range-handle-focus">
    <input type="color" name="clrHandleBorder" id="clrHandleBorder" bind:value={clrHandleBorder} title="--range-handle-border">
  </div>

  <div class="inputs">
    <span>Floating Labels</span>
    <input type="color" name="clrFloatInactive" id="clrFloatInactive" bind:value={clrFloatInactive} title="--range-float-inactive">
    <input type="color" name="clrFloat" id="clrFloat" bind:value={clrFloat} title="--range-float">
    <input type="color" name="clrFloatText" id="clrFloatText" bind:value={clrFloatText} title="--range-float-text">
  </div>

  <div class="inputs">
    <span>Pips & Labels</span>
    <input type="color" name="clrPip" id="clrPip" bind:value={clrPip} title="--range-pip">
    <input type="color" name="clrPipText" id="clrPipText" bind:value={clrPipText} title="--range-pip-text">
  </div>

  <div class="inputs">
    <span>Active & Hover Pips</span>
    <input type="color" name="clrPipActive" id="clrPipActive" bind:value={clrPipActive} title="--range-pip-active">
    <input type="color" name="clrPipActiveText" id="clrPipActiveText" bind:value={clrPipActiveText} title="--range-pip-active-text">
    <input type="color" name="clrPipHover" id="clrPipHover" bind:value={clrPipHover} title="--range-pip-hover">
    <input type="color" name="clrPipHoverText" id="clrPipHoverText" bind:value={clrPipHoverText} title="--range-pip-hover-text">
  </div>

  <div class="inputs">
    <span>Pips & Labels in Range</span>
    <input type="color" name="clrPipInRange" id="clrPipInRange" bind:value={clrPipInRange} title="--range-pip-in-range">
    <input type="color" name="clrPipInRangeText" id="clrPipInRangeText" bind:value={clrPipInRangeText} title="--range-pip-in-range-text">
  </div>

  {@html variablesStyle}

  <pre class="output-css"><code>{ variablesStyle.replace(/\s\*{}/,"") }</code></pre>

</div>

<style>
  .inputs {
    text-align: left;
    display: flex;
    gap: .25rem .5rem;
    margin-bottom: .5rem;
  }

  .inputs span {
    min-width: 180px;
    grid-column: 1/-1;
  }

  @media (min-width: 37.75em) {
    .inputs span {
      grid-column: 1;
    }
  }

  .output-css {
    margin-block: 2rem 0;
    text-align: left;
    overflow-x: auto;
    box-sizing: border-box;
    max-width: 100%;
  }
  .output-css code {
    all: unset;
  }


</style>