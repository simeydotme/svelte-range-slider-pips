<svelte:options immutable={false} />

<script>import { spring as springStore } from "svelte/motion";
import { createEventDispatcher } from "svelte";
import {
  coerceFloat,
  valueAsPercent,
  clampValue,
  constrainAndAlignValue,
  pureText,
  normalisedClient,
  elementIndex
} from "../utils.js";
import RangePips from "./RangePips.svelte";
export let slider = void 0;
export let precision = 2;
export let range = false;
export let pushy = false;
export let draggy = false;
export let min = 0;
export let max = 100;
export let step = 1;
export let values = [coerceFloat((max + min) / 2, precision)];
export let value = values[0];
export let vertical = false;
export let float = false;
export let rangeFloat = false;
export let reversed = false;
export let hoverable = true;
export let disabled = false;
export let limits = null;
export let rangeGapMin = 0;
export let rangeGapMax = Infinity;
export let pips = false;
export let pipstep = void 0;
export let all = true;
export let first = void 0;
export let last = void 0;
export let rest = void 0;
export let prefix = "";
export let suffix = "";
export let formatter = (v, i, p) => v;
export let handleFormatter = formatter;
export let rangeFormatter = null;
export let ariaLabels = [];
export let id = void 0;
let classes = "";
export { classes as class };
export let springValues = { stiffness: 0.15, damping: 0.4 };
export let spring = true;
const dispatch = createEventDispatcher();
let valueLength = 0;
let focus = false;
let handleActivated = false;
let handlePressed = false;
let rangeActivated = false;
let rangePressed = false;
let rangeDistancesFromPointer = [1, 1];
let keyboardActive = false;
let activeHandle = -1;
let startValues = [];
let previousValues = [];
let springPositions;
const updateValues = () => {
  checkValuesIsArray();
  if (values[0] !== value) {
    values[0] = value;
  }
};
const updateValue = () => {
  checkValueIsNumber();
  if (value !== values[0]) {
    value = values[0];
  }
};
const checkValueIsNumber = () => {
  if (typeof value !== "number") {
    value = (max + min) / 2;
    console.error("'value' prop should be a Number");
  }
};
const checkValuesIsArray = () => {
  if (!Array.isArray(values)) {
    values = [value];
    console.error("'values' prop should be an Array");
  }
};
const checkMinMax = () => {
  if (min >= max) {
    min = 0;
    max = 100;
    console.error("'min' prop should be less than 'max'");
  }
};
const checkAriaLabels = () => {
  if (values.length > 1 && !Array.isArray(ariaLabels)) {
    ariaLabels = [];
    console.warn(`'ariaLabels' prop should be an Array`);
  }
};
const checkValuesAgainstRangeGaps = () => {
  values = values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits));
  if (rangeGapMax < Infinity) {
    const gapMax = constrainAndAlignValue(values[0] + rangeGapMax, min, max, step, precision, limits);
    if (values[1] > gapMax) {
      values[1] = gapMax;
    }
  }
  if (rangeGapMin > 0) {
    const gapMin = constrainAndAlignValue(values[0] + rangeGapMin, min, max, step, precision, limits);
    if (values[1] < gapMin) {
      values[1] = gapMin;
    }
  }
};
const checkFormatters = () => {
  if (formatter === null || formatter === void 0) {
    console.error("formatter must be a function");
    formatter = (v, i, p) => v;
  }
  if (handleFormatter === null || handleFormatter === void 0) {
    console.error("handleFormatter must be a function");
    handleFormatter = formatter;
  }
};
checkValueIsNumber();
checkValuesIsArray();
checkValuesAgainstRangeGaps();
checkMinMax();
checkFormatters();
$: value, updateValues();
$: values, updateValue();
$: ariaLabels, checkAriaLabels();
$: min, checkMinMax();
$: max, checkMinMax();
$: formatter, checkFormatters();
$: handleFormatter, checkFormatters();
$: hasRange = range === true && values.length === 2 || (range === "min" || range === "max") && values.length === 1;
$: {
  const trimmedAlignedValues = trimRange(
    values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits))
  );
  if (!(values.length === trimmedAlignedValues.length) || !values.every((element, index) => coerceFloat(element, precision) === trimmedAlignedValues[index])) {
    values = trimmedAlignedValues;
  }
  if (valueLength !== values.length) {
    springPositions = springStore(
      values.map((v) => valueAsPercent(v, min, max)),
      springValues
    );
  } else {
    requestAnimationFrame(() => {
      springPositions.set(
        values.map((v) => valueAsPercent(v, min, max)),
        { hard: !spring }
      );
    });
  }
  valueLength = values.length;
}
$: orientationStart = vertical ? reversed ? "top" : "bottom" : reversed ? "right" : "left";
$: orientationEnd = vertical ? reversed ? "bottom" : "top" : reversed ? "left" : "right";
function targetIsHandle(el) {
  if (!slider) return false;
  const handles = slider.querySelectorAll(".handle");
  const isHandle = Array.prototype.includes.call(handles, el);
  const isChild = Array.prototype.some.call(handles, (e) => e.contains(el));
  return isHandle || isChild;
}
function trimRange(values2) {
  if (range === "min" || range === "max") {
    return values2.slice(0, 1);
  } else if (range) {
    return values2.slice(0, 2);
  } else {
    return values2;
  }
}
function getClosestHandle(clientPos) {
  if (!slider) return 0;
  const dims = slider.getBoundingClientRect();
  let handlePos = 0;
  let handlePercent = 0;
  let handleVal = 0;
  if (vertical) {
    handlePos = clientPos.y - dims.top;
    handlePercent = handlePos / dims.height * 100;
    handlePercent = reversed ? handlePercent : 100 - handlePercent;
  } else {
    handlePos = clientPos.x - dims.left;
    handlePercent = handlePos / dims.width * 100;
    handlePercent = reversed ? 100 - handlePercent : handlePercent;
  }
  handleVal = (max - min) / 100 * handlePercent + min;
  let closest;
  if (range === true && values[0] === values[1]) {
    if (handleVal > values[1]) {
      return 1;
    } else {
      return 0;
    }
  } else {
    closest = values.indexOf([...values].sort((a, b) => Math.abs(handleVal - a) - Math.abs(handleVal - b))[0]);
  }
  return closest;
}
function handleInteract(clientPos) {
  if (!slider || !handleActivated) return;
  const dims = slider.getBoundingClientRect();
  let handlePos = 0;
  let handlePercent = 0;
  let handleVal = 0;
  if (vertical) {
    handlePos = clientPos.y - dims.top;
    handlePercent = handlePos / dims.height * 100;
    handlePercent = reversed ? handlePercent : 100 - handlePercent;
  } else {
    handlePos = clientPos.x - dims.left;
    handlePercent = handlePos / dims.width * 100;
    handlePercent = reversed ? 100 - handlePercent : handlePercent;
  }
  handleVal = (max - min) / 100 * handlePercent + min;
  moveHandle(activeHandle, handleVal);
}
function getRangedistancesOnInteractionStart(clientPos) {
  if (!slider || !draggy || !rangeActivated || range === "min" || range === "max") return;
  const dims = slider.getBoundingClientRect();
  let pointerPos = 0;
  let pointerPercent = 0;
  let pointerVal = 0;
  if (vertical) {
    pointerPos = clientPos.y - dims.top;
    pointerPercent = pointerPos / dims.height * 100;
    pointerPercent = reversed ? pointerPercent : 100 - pointerPercent;
  } else {
    pointerPos = clientPos.x - dims.left;
    pointerPercent = pointerPos / dims.width * 100;
    pointerPercent = reversed ? 100 - pointerPercent : pointerPercent;
  }
  pointerVal = (max - min) / 100 * pointerPercent + min;
  rangeDistancesFromPointer = [values[0] - pointerVal, values[1] - pointerVal];
}
function rangeInteract(clientPos) {
  if (!slider || !draggy || !rangeActivated || range === "min" || range === "max") return;
  const dims = slider.getBoundingClientRect();
  let pointerPos = 0;
  let pointerPercent = 0;
  let pointerVal = 0;
  if (vertical) {
    pointerPos = clientPos.y - dims.top;
    pointerPercent = pointerPos / dims.height * 100;
    pointerPercent = reversed ? pointerPercent : 100 - pointerPercent;
  } else {
    pointerPos = clientPos.x - dims.left;
    pointerPercent = pointerPos / dims.width * 100;
    pointerPercent = reversed ? 100 - pointerPercent : pointerPercent;
  }
  pointerVal = (max - min) / 100 * pointerPercent + min;
  activeHandle = -1;
  moveHandle(0, pointerVal + rangeDistancesFromPointer[0], false);
  moveHandle(1, pointerVal + rangeDistancesFromPointer[1], true);
}
function moveHandle(index, value2, fireEvent = true) {
  value2 = constrainAndAlignValue(value2, min, max, step, precision, limits);
  if (index === null) {
    index = activeHandle;
  }
  if (range === true) {
    if (index === 0) {
      if (value2 > values[1] - rangeGapMin) {
        if (pushy && value2 < (limits?.[1] ?? max) - rangeGapMin) {
          values[1] = value2 + rangeGapMin;
        } else {
          value2 = values[1] - rangeGapMin;
        }
      } else if (value2 < values[1] - rangeGapMax) {
        if (pushy) {
          values[1] = value2 + rangeGapMax;
        } else {
          value2 = values[1] - rangeGapMax;
        }
      }
    } else if (index === 1) {
      if (value2 < values[0] + rangeGapMin) {
        if (pushy && value2 > (limits?.[0] ?? min) + rangeGapMin) {
          values[0] = value2 - rangeGapMin;
        } else {
          value2 = values[0] + rangeGapMin;
        }
      } else if (value2 > values[0] + rangeGapMax) {
        if (pushy) {
          values[0] = value2 - rangeGapMax;
        } else {
          value2 = values[0] + rangeGapMax;
        }
      }
    }
  }
  if (values[index] !== value2) {
    constrainAndAlignValue(values[index] = value2, min, max, step, precision, limits);
  }
  if (fireEvent) {
    fireChangeEvent(values);
  }
  return value2;
}
function fireChangeEvent(values2) {
  const hasChanged = previousValues.some((prev, index) => {
    return prev !== values2[index];
  });
  if (hasChanged) {
    eChange();
    previousValues = [...values2];
  }
}
function rangeStart(values2) {
  if (range === "min") {
    return 0;
  } else {
    return values2[0];
  }
}
function rangeEnd(values2) {
  if (range === "max") {
    return 0;
  } else if (range === "min") {
    return 100 - values2[0];
  } else {
    return 100 - values2[1];
  }
}
function sliderBlurHandle(event) {
  const target = event.target;
  if (keyboardActive) {
    focus = false;
    handleActivated = false;
    handlePressed = false;
    rangeActivated = false;
    rangePressed = false;
  }
}
function sliderFocusHandle(event) {
  const target = event.target;
  if (!disabled) {
    activeHandle = elementIndex(target);
    focus = true;
  }
}
function sliderKeydown(event) {
  if (!disabled) {
    let prevent = false;
    const handle = elementIndex(event.target);
    let jump = step;
    if (event.ctrlKey || event.metaKey) {
      const onePercent = (max - min) / 100;
      jump = Math.max(step, Math.round(onePercent / step) * step);
    } else if (event.shiftKey || event.key === "PageUp" || event.key === "PageDown") {
      const tenPercent = (max - min) / 10;
      jump = Math.max(step, Math.round(tenPercent / step) * step);
    }
    switch (event.key) {
      case "PageUp":
      case "ArrowRight":
      case "ArrowUp":
        moveHandle(handle, values[handle] + coerceFloat(jump, precision));
        prevent = true;
        break;
      case "PageDown":
      case "ArrowLeft":
      case "ArrowDown":
        moveHandle(handle, values[handle] - coerceFloat(jump, precision));
        prevent = true;
        break;
      case "Home":
        moveHandle(handle, min);
        prevent = true;
        break;
      case "End":
        moveHandle(handle, max);
        prevent = true;
        break;
    }
    if (prevent) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
function sliderInteractStart(event) {
  if (!disabled) {
    const target = event.target;
    const clientPos = normalisedClient(event);
    focus = true;
    if (target.matches(".rangeBar") && range === true && draggy) {
      handleActivated = false;
      handlePressed = false;
      activeHandle = -1;
      rangeActivated = true;
      rangePressed = true;
      getRangedistancesOnInteractionStart(clientPos);
    } else {
      handleActivated = true;
      handlePressed = true;
      activeHandle = getClosestHandle(clientPos);
      if (event.type === "touchstart" && !target.matches(".pipVal")) {
        handleInteract(clientPos);
      }
    }
    startValues = values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits));
    previousValues = [...startValues];
    eStart();
  }
}
function sliderInteractEnd(event) {
  if (event.type === "touchend") {
    eStop();
  }
  handlePressed = false;
  rangePressed = false;
}
function bodyInteractStart(event) {
  const target = event.target;
  keyboardActive = false;
  if (slider && focus && target !== slider && !slider.contains(target)) {
    focus = false;
  }
}
function bodyInteract(event) {
  if (!disabled) {
    if (handleActivated) {
      handleInteract(normalisedClient(event));
    } else if (rangeActivated) {
      rangeInteract(normalisedClient(event));
    }
  }
}
function bodyMouseUp(event) {
  if (!disabled) {
    const target = event.target;
    if (handleActivated) {
      if (slider && (target === slider || slider.contains(target))) {
        focus = true;
        if (!targetIsHandle(target) && !target.matches(".pipVal")) {
          handleInteract(normalisedClient(event));
        }
      }
    }
    if (handleActivated || rangeActivated) {
      eStop();
    }
  }
  handleActivated = false;
  handlePressed = false;
  rangeActivated = false;
  rangePressed = false;
}
function bodyTouchEnd(event) {
  handleActivated = false;
  handlePressed = false;
  rangeActivated = false;
  rangePressed = false;
}
function bodyKeyDown(event) {
  const target = event.target;
  if (!disabled && slider) {
    if (target === slider || slider.contains(target)) {
      keyboardActive = true;
    }
  }
}
function eStart() {
  if (disabled) return;
  dispatch("start", {
    activeHandle,
    value: startValues[activeHandle],
    values: startValues
  });
}
function eStop() {
  if (disabled) return;
  const startValue = rangeActivated ? startValues : startValues[activeHandle];
  dispatch("stop", {
    activeHandle,
    startValue,
    value: values[activeHandle],
    values: values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits))
  });
}
function eChange() {
  if (disabled) return;
  const startValue = rangeActivated ? startValues : startValues[activeHandle];
  const previousValue = typeof previousValues === "undefined" ? startValue : rangeActivated ? previousValues : previousValues[activeHandle];
  dispatch("change", {
    activeHandle,
    startValue,
    previousValue,
    value: values[activeHandle],
    values: values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits))
  });
}
function ariaLabelFormatter(value2, index) {
  const percent = valueAsPercent(value2, min, max, precision);
  const formattedValue = handleFormatter(value2, index, percent);
  const textLabel = pureText(String(formattedValue));
  return `${prefix}${textLabel}${suffix}`;
}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  {id}
  bind:this={slider}
  role="none"
  class="rangeSlider {classes}"
  class:rsRange={hasRange}
  class:rsDrag={hasRange && draggy}
  class:rsMin={hasRange && range === 'min'}
  class:rsMax={hasRange && range === 'max'}
  class:rsDisabled={disabled}
  class:rsHoverable={hoverable}
  class:rsVertical={vertical}
  class:rsReversed={reversed}
  class:rsFocus={focus}
  class:rsPips={pips}
  class:rsPipLabels={all === 'label' || first === 'label' || last === 'label' || rest === 'label'}
  on:mousedown={sliderInteractStart}
  on:mouseup={sliderInteractEnd}
  on:touchstart|preventDefault={sliderInteractStart}
  on:touchend|preventDefault={sliderInteractEnd}
>
  {#each values as value, index}
    {@const zindex = `z-index: ${activeHandle === index ? 3 : 2};`}
    {@const handlePos = `${orientationStart}: ${$springPositions[index]}%;`}
    <span
      role="slider"
      class="rangeHandle"
      class:rsActive={focus && activeHandle === index}
      class:rsPress={handlePressed && activeHandle === index}
      data-handle={index}
      on:blur={sliderBlurHandle}
      on:focus={sliderFocusHandle}
      on:keydown={sliderKeydown}
      style="{handlePos} {zindex}"
      aria-label={ariaLabels[index]}
      aria-valuemin={range === true && index === 1 ? values[0] : min}
      aria-valuemax={range === true && index === 0 ? values[1] : max}
      aria-valuenow={value}
      aria-valuetext={ariaLabelFormatter(value, index)}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      aria-disabled={disabled}
      tabindex={disabled ? -1 : 0}
    >
      <span class="rangeNub" />
      {#if float}
        {@const percent = valueAsPercent(value, min, max, precision)}
        {@const formattedValue = handleFormatter(value, index, percent)}
        <span class="rangeFloat">
          {#if prefix}<span class="rangeFloatPrefix">{prefix}</span>{/if}{@html formattedValue}{#if suffix}<span
              class="rangeFloatSuffix">{suffix}</span
            >{/if}
        </span>
      {/if}
    </span>
  {/each}
  {#if limits}
    <span
      class="rangeLimit"
      style="{orientationStart}: {valueAsPercent(limits[0], min, max, precision)}%;
             {orientationEnd}: {100 - valueAsPercent(limits[1], min, max, precision)}%;"
    />
  {/if}
  {#if hasRange}
    <span
      class="rangeBar"
      class:rsPress={rangePressed}
      style="{orientationStart}: {rangeStart($springPositions)}%; 
             {orientationEnd}: {rangeEnd($springPositions)}%;"
    >
      {#if rangeFloat}
        <span class="rangeFloat">
          {#if rangeFormatter}
            {@html rangeFormatter(
              values[0],
              values[1],
              valueAsPercent(values[0], min, max, precision),
              valueAsPercent(values[1], min, max, precision)
            )}
          {:else}
            {@const [first, second] = reversed ? [values[1], values[0]] : [values[0], values[1]]}
            {#if prefix}<span class="rangeFloatPrefix">{prefix}</span>{/if}{@html first}{#if suffix}<span
                class="rangeFloatSuffix">{suffix}</span
              >{/if}
            {' '}-{' '}
            {#if prefix}<span class="rangeFloatPrefix">{prefix}</span>{/if}{@html second}{#if suffix}<span
                class="rangeFloatSuffix">{suffix}</span
              >{/if}
          {/if}
        </span>
      {/if}
    </span>
  {/if}
  {#if pips}
    <RangePips
      {values}
      {min}
      {max}
      {step}
      {range}
      {vertical}
      {reversed}
      {orientationStart}
      {hoverable}
      {disabled}
      {limits}
      {all}
      {first}
      {last}
      {rest}
      {pipstep}
      {prefix}
      {suffix}
      {formatter}
      {precision}
      {focus}
      {moveHandle}
    />
  {/if}
</div>

<svelte:window
  on:mousedown={bodyInteractStart}
  on:touchstart={bodyInteractStart}
  on:mousemove={bodyInteract}
  on:touchmove={bodyInteract}
  on:mouseup={bodyMouseUp}
  on:touchend={bodyTouchEnd}
  on:keydown={bodyKeyDown}
/>

<style>
  /**
   * RangeSlider
   */

  :global(.rangeSlider) {
    --slider: var(--range-slider, #d7dada);
    --handle-inactive: var(--range-handle-inactive, #99a2a2);
    --handle: var(--range-handle, #838de7);
    --handle-focus: var(--range-handle-focus, #4a40d4);
    --handle-border: var(--range-handle-border, var(--handle));
    --range-inactive: var(--range-range-inactive, var(--handle-inactive));
    --range: var(--range-range, var(--handle-focus));
    --range-limit: var(--range-range-limit, #b9c2c2);
    --range-hover: var(--range-range-hover, var(--handle-border));
    --range-press: var(--range-range-press, var(--handle-border));
    --float-inactive: var(--range-float-inactive, var(--handle-inactive));
    --float: var(--range-float, var(--handle-focus));
    --float-text: var(--range-float-text, white);
  }

  :global(.rangeSlider) {
    position: relative;
    border-radius: 100px;
    height: 0.5em;
    margin: 1em;
    transition: opacity 0.2s ease;
    user-select: none;
    overflow: visible;
  }

  :global(.rangeSlider *) {
    user-select: none;
  }

  :global(.rangeSlider.rsPips) {
    margin-bottom: 1.8em;
  }

  :global(.rangeSlider.rsPipLabels) {
    margin-bottom: 2.8em;
  }

  :global(.rangeSlider.rsVertical) {
    display: inline-block;
    border-radius: 100px;
    width: 0.5em;
    min-height: 200px;
  }

  :global(.rangeSlider.rsVertical.rsPips) {
    margin-right: 1.8em;
    margin-bottom: 1em;
  }

  :global(.rangeSlider.rsVertical.rsPipLabels) {
    margin-right: 2.8em;
    margin-bottom: 1em;
  }

  :global(.rangeSlider .rangeHandle) {
    position: absolute;
    display: block;
    height: 1.4em;
    width: 1.4em;
    top: 0.25em;
    bottom: auto;
    transform: translateY(-50%) translateX(-50%);
    z-index: 2;
  }

  :global(.rangeSlider.rsReversed .rangeHandle) {
    transform: translateY(-50%) translateX(50%);
  }

  :global(.rangeSlider.rsVertical .rangeHandle) {
    left: 0.25em;
    top: auto;
    transform: translateY(50%) translateX(-50%);
  }

  :global(.rangeSlider.rsVertical.rsReversed .rangeHandle) {
    transform: translateY(-50%) translateX(-50%);
  }

  :global(.rangeSlider .rangeNub),
  :global(.rangeSlider .rangeHandle:before) {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    border-radius: 10em;
    height: 100%;
    width: 100%;
    transition: box-shadow 0.2s ease;
  }

  :global(.rangeSlider .rangeHandle:before) {
    content: '';
    left: 1px;
    top: 1px;
    bottom: 1px;
    right: 1px;
    height: auto;
    width: auto;
    box-shadow: 0 0 0 0px var(--handle-border);
    opacity: 0;
  }

  :global(.rangeSlider.rsHoverable:not(.rsDisabled) .rangeHandle:hover:before) {
    box-shadow: 0 0 0 8px var(--handle-border);
    opacity: 0.2;
  }

  :global(.rangeSlider.rsHoverable:not(.rsDisabled) .rangeHandle.rsPress:before),
  :global(.rangeSlider.rsHoverable:not(.rsDisabled) .rangeHandle.rsPress:hover:before) {
    box-shadow: 0 0 0 12px var(--handle-border);
    opacity: 0.4;
  }

  :global(.rangeSlider.rsRange:not(.rsMin):not(.rsMax) .rangeNub) {
    border-radius: 10em 10em 10em 1.6em;
  }

  :global(.rangeSlider.rsRange .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(-135deg);
  }

  :global(.rangeSlider.rsRange .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(45deg);
  }

  :global(.rangeSlider.rsRange.rsReversed .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(45deg);
  }

  :global(.rangeSlider.rsRange.rsReversed .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(-135deg);
  }

  :global(.rangeSlider.rsRange.rsVertical .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(135deg);
  }

  :global(.rangeSlider.rsRange.rsVertical .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(-45deg);
  }

  :global(.rangeSlider.rsRange.rsVertical.rsReversed .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(-45deg);
  }

  :global(.rangeSlider.rsRange.rsVertical.rsReversed .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(135deg);
  }

  :global(.rangeSlider .rangeFloat) {
    display: block;
    position: absolute;
    left: 50%;
    bottom: 1.75em;
    transform: translate(-50%, -50%);
    font-size: 1em;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    white-space: nowrap;
    transition: all 0.2s ease;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    border-radius: 0.2em;
    z-index: 3;
  }

  :global(.rangeSlider .rangeHandle.rsActive .rangeFloat),
  :global(.rangeSlider.rsHoverable .rangeHandle:hover .rangeFloat),
  :global(.rangeSlider.rsHoverable .rangeBar:hover .rangeFloat),
  :global(.rangeSlider.rsFocus .rangeBar .rangeFloat) {
    opacity: 1;
    transform: translate(-50%, 0%);
  }

  :global(.rangeSlider .rangeBar .rangeFloat) {
    bottom: 0.875em;
    z-index: 2;
  }

  :global(.rangeSlider.rsVertical .rangeFloat) {
    top: 50%;
    bottom: auto;
    left: auto;
    right: 1.75em;
    transform: translate(-50%, -50%);
  }

  :global(.rangeSlider.rsVertical .rangeHandle.rsActive .rangeFloat),
  :global(.rangeSlider.rsVertical.rsHoverable .rangeHandle:hover .rangeFloat),
  :global(.rangeSlider.rsVertical.rsHoverable .rangeBar:hover .rangeFloat),
  :global(.rangeSlider.rsVertical.rsFocus .rangeBar .rangeFloat) {
    transform: translate(0%, -50%);
  }

  :global(.rangeSlider.rsVertical .rangeBar .rangeFloat) {
    right: 0.875em;
  }

  :global(.rangeSlider .rangeBar),
  :global(.rangeSlider .rangeLimit),
  :global(.rangeSlider.rsDrag .rangeBar::before) {
    position: absolute;
    display: block;
    transition: background 0.2s ease;
    border-radius: 1em;
    height: 0.5em;
    top: 0;
    user-select: none;
    z-index: 1;
  }

  :global(.rangeSlider.rsVertical .rangeBar),
  :global(.rangeSlider.rsVertical .rangeLimit),
  :global(.rangeSlider.rsVertical.rsDrag .rangeBar::before) {
    width: 0.5em;
    height: auto;
  }

  :global(.rangeSlider.rsDrag .rangeBar::before) {
    content: '';
    inset: 0;
    top: -0.5em;
    bottom: -0.5em;
    height: auto;
    background-color: var(--range-hover);
    opacity: 0;
    transition:
      opacity 0.2s ease,
      scale 0.2s ease;
  }

  :global(.rangeSlider.rsVertical.rsDrag .rangeBar::before) {
    inset: 0;
    left: -0.5em;
    right: -0.5em;
    width: auto;
  }

  :global(.rangeSlider.rsHoverable:not(.rsDisabled).rsDrag .rangeBar:hover::before) {
    opacity: 0.2;
  }

  :global(.rangeSlider.rsHoverable:not(.rsDisabled).rsDrag .rangeBar.rsPress::before) {
    opacity: 0.4;
    scale: 1 1.25;
  }

  :global(.rangeSlider.rsVertical.rsHoverable:not(.rsDisabled).rsDrag .rangeBar.rsPress::before) {
    scale: 1.25 1;
  }

  :global(.rangeSlider) {
    background-color: #d7dada;
    background-color: var(--slider);
  }

  :global(.rangeSlider .rangeBar) {
    background-color: #99a2a2;
    background-color: var(--range-inactive);
  }

  :global(.rangeSlider.rsFocus .rangeBar) {
    background-color: #838de7;
    background-color: var(--range);
  }

  :global(.rangeSlider .rangeLimit) {
    background-color: #99a2a280;
    background-color: var(--range-limit);
  }

  :global(.rangeSlider .rangeNub) {
    background-color: #99a2a2;
    background-color: var(--handle-inactive);
  }

  :global(.rangeSlider.rsFocus .rangeNub) {
    background-color: #838de7;
    background-color: var(--handle);
  }

  :global(.rangeSlider .rangeHandle.rsActive .rangeNub) {
    background-color: #4a40d4;
    background-color: var(--handle-focus);
  }

  :global(.rangeSlider .rangeFloat) {
    color: white;
    color: var(--float-text);
    background-color: #99a2a2;
    background-color: var(--float-inactive);
  }

  :global(.rangeSlider.rsFocus .rangeFloat) {
    background-color: #4a40d4;
    background-color: var(--float);
  }

  :global(.rangeSlider.rsDisabled) {
    opacity: 0.5;
  }

  :global(.rangeSlider.rsDisabled .rangeNub) {
    background-color: #d7dada;
    background-color: var(--slider);
  }
</style>
