<svelte:options immutable={false} />

<script>import { spring } from "svelte/motion";
import { createEventDispatcher } from "svelte";
import {
  coerceFloat,
  valueAsPercent,
  clampValue,
  alignValueToStep,
  pureText,
  normalisedClient,
  elementIndex
} from "../utils.js";
import RangePips from "./RangePips.svelte";
export let slider = void 0;
export let range = false;
export let pushy = false;
export let min = 0;
export let max = 100;
export let step = 1;
export let values = [(max + min) / 2];
export let value = values[0];
export let vertical = false;
export let float = false;
export let reversed = false;
export let hoverable = true;
export let disabled = false;
export let limits = null;
export let pips = false;
export let pipstep = void 0;
export let all = true;
export let first = void 0;
export let last = void 0;
export let rest = void 0;
export let id = void 0;
export let prefix = "";
export let suffix = "";
export let formatter = (v, i, p) => v;
export let handleFormatter = formatter;
export let ariaLabels = [];
export let precision = 2;
export let springValues = { stiffness: 0.15, damping: 0.4 };
const dispatch = createEventDispatcher();
let valueLength = 0;
let focus = false;
let handleActivated = false;
let handlePressed = false;
let keyboardActive = false;
let activeHandle = values.length - 1;
let startValue;
let previousValue;
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
const checkAriaLabels = () => {
  if (values.length > 1 && !Array.isArray(ariaLabels)) {
    console.warn(`'ariaLabels' prop should be an Array`);
  }
};
checkValueIsNumber();
checkValuesIsArray();
$:
  value, updateValues();
$:
  values, updateValue();
$:
  ariaLabels, checkAriaLabels();
$: {
  const trimmedAlignedValues = trimRange(
    values.map((v) => alignValueToStep(v, min, max, step, precision, limits))
  );
  if (!(values.length === trimmedAlignedValues.length) || !values.every(
    (element, index) => coerceFloat(element, precision) === trimmedAlignedValues[index]
  )) {
    values = trimmedAlignedValues;
  }
  if (valueLength !== values.length) {
    springPositions = spring(
      values.map((v) => valueAsPercent(v, min, max)),
      springValues
    );
  } else {
    springPositions.set(values.map((v) => valueAsPercent(v, min, max)));
  }
  valueLength = values.length;
}
$:
  orientationStart = vertical ? reversed ? "top" : "bottom" : reversed ? "right" : "left";
$:
  orientationEnd = vertical ? reversed ? "bottom" : "top" : reversed ? "left" : "right";
function targetIsHandle(el) {
  if (!slider)
    return false;
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
  if (!slider)
    return 0;
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
    closest = values.indexOf(
      [...values].sort((a, b) => Math.abs(handleVal - a) - Math.abs(handleVal - b))[0]
    );
  }
  return closest;
}
function handleInteract(clientPos) {
  if (!slider)
    return;
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
function moveHandle(index, value2) {
  value2 = alignValueToStep(value2, min, max, step, precision, limits);
  if (index === null) {
    index = activeHandle;
  }
  if (range) {
    if (index === 0 && value2 > values[1]) {
      if (pushy) {
        values[1] = value2;
      } else {
        value2 = values[1];
      }
    } else if (index === 1 && value2 < values[0]) {
      if (pushy) {
        values[0] = value2;
      } else {
        value2 = values[0];
      }
    }
  }
  if (values[index] !== value2) {
    values[index] = value2;
  }
  if (previousValue !== value2) {
    eChange();
    previousValue = value2;
  }
  return value2;
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
      jump = clampValue(
        (max - min) / step / 100,
        coerceFloat(jump, precision),
        coerceFloat((max - min) / 100, precision)
      );
    } else if (event.shiftKey) {
      jump = clampValue(
        (max - min) / step / 10,
        coerceFloat(jump, precision),
        coerceFloat((max - min) / 10, precision)
      );
    }
    switch (event.key) {
      case "PageDown":
        jump *= 10;
      case "ArrowRight":
      case "ArrowUp":
        moveHandle(handle, values[handle] + coerceFloat(jump, precision));
        prevent = true;
        break;
      case "PageUp":
        jump *= 10;
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
    handleActivated = true;
    handlePressed = true;
    activeHandle = getClosestHandle(clientPos);
    startValue = previousValue = alignValueToStep(
      values[activeHandle],
      min,
      max,
      step,
      precision,
      limits
    );
    eStart();
    if (event.type === "touchstart" && !target.matches(".pipVal")) {
      handleInteract(clientPos);
    }
  }
}
function sliderInteractEnd(event) {
  if (event.type === "touchend") {
    eStop();
  }
  handlePressed = false;
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
      eStop();
    }
  }
  handleActivated = false;
  handlePressed = false;
}
function bodyTouchEnd(event) {
  handleActivated = false;
  handlePressed = false;
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
  !disabled && dispatch("start", {
    activeHandle,
    value: startValue,
    values: values.map((v) => alignValueToStep(v, min, max, step, precision, limits))
  });
}
function eStop() {
  !disabled && dispatch("stop", {
    activeHandle,
    startValue,
    value: values[activeHandle],
    values: values.map((v) => alignValueToStep(v, min, max, step, precision, limits))
  });
}
function eChange() {
  !disabled && dispatch("change", {
    activeHandle,
    startValue,
    previousValue: typeof previousValue === "undefined" ? startValue : previousValue,
    value: values[activeHandle],
    values: values.map((v) => alignValueToStep(v, min, max, step, precision, limits))
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
  class="rangeSlider"
  class:range
  class:disabled
  class:hoverable
  class:vertical
  class:reversed
  class:focus
  class:min={range === 'min'}
  class:max={range === 'max'}
  class:pips
  class:pip-labels={all === 'label' || first === 'label' || last === 'label' || rest === 'label'}
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
      class:active={focus && activeHandle === index}
      class:press={handlePressed && activeHandle === index}
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
          {#if prefix}<span class="rangeFloat-prefix">{prefix}</span
            >{/if}{@html formattedValue}{#if suffix}<span class="rangeFloat-suffix">{suffix}</span
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
  {#if range}
    <span
      class="rangeBar"
      style="{orientationStart}: {rangeStart($springPositions)}%; 
             {orientationEnd}: {rangeEnd($springPositions)}%;"
    />
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
  }

  :global(.rangeSlider *) {
    user-select: none;
  }

  :global(.rangeSlider.pips) {
    margin-bottom: 1.8em;
  }

  :global(.rangeSlider.pip-labels) {
    margin-bottom: 2.8em;
  }

  :global(.rangeSlider.vertical) {
    display: inline-block;
    border-radius: 100px;
    width: 0.5em;
    min-height: 200px;
  }

  :global(.rangeSlider.vertical.pips) {
    margin-right: 1.8em;
    margin-bottom: 1em;
  }

  :global(.rangeSlider.vertical.pip-labels) {
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

  :global(.rangeSlider.reversed .rangeHandle) {
    transform: translateY(-50%) translateX(50%);
  }

  :global(.rangeSlider.vertical .rangeHandle) {
    left: 0.25em;
    top: auto;
    transform: translateY(50%) translateX(-50%);
  }

  :global(.rangeSlider.vertical.reversed .rangeHandle) {
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

  :global(.rangeSlider.hoverable:not(.disabled) .rangeHandle:hover:before) {
    box-shadow: 0 0 0 8px var(--handle-border);
    opacity: 0.2;
  }

  :global(.rangeSlider.hoverable:not(.disabled) .rangeHandle.press:before),
  :global(.rangeSlider.hoverable:not(.disabled) .rangeHandle.press:hover:before) {
    box-shadow: 0 0 0 12px var(--handle-border);
    opacity: 0.4;
  }

  :global(.rangeSlider.range:not(.min):not(.max) .rangeNub) {
    border-radius: 10em 10em 10em 1.6em;
  }

  :global(.rangeSlider.range .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(-135deg);
  }

  :global(.rangeSlider.range .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(45deg);
  }

  :global(.rangeSlider.range.reversed .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(45deg);
  }

  :global(.rangeSlider.range.reversed .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(-135deg);
  }

  :global(.rangeSlider.range.vertical .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(135deg);
  }

  :global(.rangeSlider.range.vertical .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(-45deg);
  }

  :global(.rangeSlider.range.vertical.reversed .rangeHandle:nth-of-type(1) .rangeNub) {
    transform: rotate(-45deg);
  }

  :global(.rangeSlider.range.vertical.reversed .rangeHandle:nth-of-type(2) .rangeNub) {
    transform: rotate(135deg);
  }

  :global(.rangeSlider .rangeFloat) {
    display: block;
    position: absolute;
    left: 50%;
    top: -0.5em;
    transform: translate(-50%, -100%);
    font-size: 1em;
    text-align: center;
    opacity: 0;
    pointer-events: none;
    white-space: nowrap;
    transition: all 0.2s ease;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
    border-radius: 0.2em;
  }

  :global(.rangeSlider .rangeHandle.active .rangeFloat),
  :global(.rangeSlider.hoverable .rangeHandle:hover .rangeFloat) {
    opacity: 1;
    top: -0.2em;
    transform: translate(-50%, -100%);
  }

  :global(.rangeSlider .rangeBar),
  :global(.rangeSlider .rangeLimit) {
    position: absolute;
    display: block;
    transition: background 0.2s ease;
    border-radius: 1em;
    height: 0.5em;
    top: 0;
    user-select: none;
    z-index: 1;
  }

  :global(.rangeSlider.vertical .rangeBar),
  :global(.rangeSlider.vertical .rangeLimit) {
    width: 0.5em;
    height: auto;
  }

  :global(.rangeSlider) {
    background-color: #d7dada;
    background-color: var(--slider);
  }

  :global(.rangeSlider .rangeBar) {
    background-color: #99a2a2;
    background-color: var(--range-inactive);
  }

  :global(.rangeSlider.focus .rangeBar) {
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

  :global(.rangeSlider.focus .rangeNub) {
    background-color: #838de7;
    background-color: var(--handle);
  }

  :global(.rangeSlider .rangeHandle.active .rangeNub) {
    background-color: #4a40d4;
    background-color: var(--handle-focus);
  }

  :global(.rangeSlider .rangeFloat) {
    color: white;
    color: var(--float-text);
    background-color: #99a2a2;
    background-color: var(--float-inactive);
  }

  :global(.rangeSlider.focus .rangeFloat) {
    background-color: #4a40d4;
    background-color: var(--float);
  }

  :global(.rangeSlider.disabled) {
    opacity: 0.5;
  }

  :global(.rangeSlider.disabled .rangeNub) {
    background-color: #d7dada;
    background-color: var(--slider);
  }
</style>
