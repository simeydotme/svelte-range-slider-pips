<svelte:options immutable={false} />

<script lang="ts">
  import { type SpringOpts, type Spring, spring as springStore } from 'svelte/motion';
  import { createEventDispatcher, onMount } from 'svelte';
  import {
    isFiniteNumber,
    coerceFloat,
    valueAsPercent,
    clampValue,
    constrainAndAlignValue,
    pureText,
    normalisedClient,
    elementIndex,
    percentAsValue,
    calculatePointerValues
  } from '$lib/utils.js';
  import type { Pip, Formatter, NormalisedClient, RangeFormatter } from '$lib/types.js';

  import RangePips from './RangePips.svelte';

  // dom references
  export let slider: HTMLDivElement | undefined = undefined;

  // precision prop
  export let precision: number = 2;

  // range slider props
  export let range: boolean | 'min' | 'max' = false;
  export let pushy: boolean = false;
  export let draggy: boolean = false;
  export let min: number = 0;
  export let max: number = 100;
  export let step: number = 1;
  export let values: number[] = [coerceFloat((max + min) / 2, precision)];
  export let value: number = values[0];
  export let vertical: boolean = false;
  export let float: boolean = false;
  export let rangeFloat: boolean = false;
  export let reversed: boolean = false;
  export let hoverable: boolean = true;
  export let disabled: boolean = false;
  export let limits: null | [number, number] = null;
  export let rangeGapMin: number = 0;
  export let rangeGapMax: number = Infinity;

  // range pips / values props
  export let pips: boolean = false;
  export let pipstep: number | undefined = undefined;
  export let all: Pip = true;
  export let first: Pip = undefined;
  export let last: Pip = undefined;
  export let rest: Pip = undefined;

  // formatting props
  export let prefix: string = '';
  export let suffix: string = '';
  export let formatter: Formatter = (v, i, p) => v;
  export let handleFormatter: Formatter = formatter;
  export let rangeFormatter: RangeFormatter | null = null;
  export let ariaLabels: string[] = [];

  // stylistic props
  export let id: string | undefined = undefined;
  let classes = '';
  export { classes as class };
  export let style: string | undefined = undefined;
  export let springValues: SpringOpts = { stiffness: 0.15, damping: 0.4 };
  export let spring = true;

  // prepare dispatched events
  const dispatch = createEventDispatcher();

  // state management
  let valueLength = 0;
  let focus = false;
  let handleActivated = false;
  let handlePressed = false;
  let rangeActivated = false;
  let rangePressed = false;
  let rangeDistancesFromPointer = [1, 1];
  let keyboardActive = false;
  let activeHandle = -1;
  let startValues: (number | undefined)[] = [];
  let previousValues: (number | undefined)[] = [];
  let sliderSize = 0;
  let rangeSize = 0;
  let rangeStart = 0;

  // copy the initial values in to a spring function which
  // will update every time the values array is modified
  let springPositions: Spring<number[]>;

  // check that "values" is an array, or set it as array
  const updateValues = () => {
    checkValuesIsArray();
    // sync values with value
    if (values[0] !== value) {
      values[0] = value;
    }
  };

  // check that "value" is a number, or set it as the average
  const updateValue = () => {
    checkValueIsNumber();
    // sync value with values
    if (value !== values[0]) {
      value = values[0];
    }
  };

  const checkMinMax = () => {
    if (!isFiniteNumber(min)) {
      min = 0;
      console.error("'min' prop must be a valid finite number");
    }
    if (!isFiniteNumber(max)) {
      max = 100;
      console.error("'max' prop must be a valid finite number");
    }
    if (min >= max) {
      min = 0;
      max = 100;
      console.error("'min' prop should be less than 'max'");
    }
    min = coerceFloat(min, precision);
    max = coerceFloat(max, precision);
  };

  const checkValueIsNumber = () => {
    if (typeof value !== 'number') {
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
      ariaLabels = [];
      console.warn(`'ariaLabels' prop should be an Array`);
    }
  };

  const checkValuesAgainstRangeGaps = () => {
    // first, align the values to the step
    values = values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits));
    // rangeGaps should be positive
    if (rangeGapMin < 0) rangeGapMin = 0;
    if (rangeGapMax < 0) rangeGapMax = Infinity;
    // rangeGapMin must be less than rangeGapMax
    if (rangeGapMin > rangeGapMax) rangeGapMin = rangeGapMax;
    // then, check the values against the range gaps
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
    if (formatter === null || formatter === undefined) {
      console.error('formatter must be a function');
      formatter = (v, i, p) => v;
    }
    if (handleFormatter === null || handleFormatter === undefined) {
      console.error('handleFormatter must be a function');
      handleFormatter = formatter;
    }
  };

  // fixup the value/values at render
  checkMinMax();
  checkValueIsNumber();
  checkValuesIsArray();
  checkValuesAgainstRangeGaps();
  checkFormatters();

  // keep value and values in sync with each other
  $: value, updateValues();
  $: values, updateValue();
  $: ariaLabels, checkAriaLabels();
  $: min, checkMinMax();
  $: max, checkMinMax();
  $: formatter, checkFormatters();
  $: handleFormatter, checkFormatters();
  $: hasRange =
    (range === true && values.length === 2) || ((range === 'min' || range === 'max') && values.length === 1);

  $: {
    // trim the range so it remains as a min/max (only 2 handles)
    // and also align the handles to the steps
    const trimmedAlignedValues = trimRange(
      values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits))
    );
    if (
      !(values.length === trimmedAlignedValues.length) ||
      !values.every((element, index) => coerceFloat(element, precision) === trimmedAlignedValues[index])
    ) {
      values = trimmedAlignedValues;
    }

    // check if the valueLength (length of values[]) has changed,
    // because if so we need to re-seed the spring function with the
    // new values array.
    if (valueLength !== values.length) {
      // set the initial spring values when the slider initialises,
      // or when values array length has changed
      springPositions = springStore(
        values.map((v) => valueAsPercent(v, min, max)),
        springValues
      );
    } else {
      // update the value of the spring function for animated handles
      // whenever the values has updated
      requestAnimationFrame(() => {
        springPositions.set(
          values.map((v) => valueAsPercent(v, min, max)),
          { hard: !spring }
        );
      });
    }
    // set the valueLength for the next check
    valueLength = values.length;
  }

  /**
   * the orientation of the handles/pips based on the
   * input values of vertical and reversed
   **/
  $: orientationStart = vertical
    ? reversed
      ? 'top'
      : 'bottom'
    : reversed
      ? 'right'
      : ('left' as 'left' | 'right' | 'top' | 'bottom');
  $: orientationEnd = vertical
    ? reversed
      ? 'bottom'
      : 'top'
    : reversed
      ? 'left'
      : ('right' as 'left' | 'right' | 'top' | 'bottom');

  /**
   * observe slider element size changes using ResizeObserver
   * to update dimensions and recalculate handle positions
   **/
  function updateSliderSize(slider: HTMLDivElement | undefined) {
    return requestAnimationFrame(() => {
      if (slider) {
        const dims = slider.getBoundingClientRect();
        sliderSize = vertical ? dims.height : dims.width;
      }
    });
  }

  let resizeObserver: ResizeObserver;
  let rafId: number;

  onMount(() => {
    if (slider) {
      resizeObserver = new ResizeObserver((entries) => {
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
        rafId = updateSliderSize(entries[0].target as HTMLDivElement);
      }) as ResizeObserver;
      resizeObserver.observe(slider);
    }
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect?.();
    };
  });

  /**
   * check if an element is a handle on the slider
   * @param {object} el dom object reference we want to check
   * @returns {boolean}
   **/
  function targetIsHandle(el: Element) {
    if (!slider) return false;
    const handles = slider.querySelectorAll('.handle');
    const isHandle = Array.prototype.includes.call(handles, el);
    const isChild = Array.prototype.some.call(handles, (e) => e.contains(el));
    return isHandle || isChild;
  }

  /**
   * trim the values array based on whether the property
   * for 'range' is 'min', 'max', or truthy. This is because we
   * do not want more than one handle for a min/max range, and we do
   * not want more than two handles for a true range.
   * @param {array} values the input values for the rangeSlider
   * @return {array} the range array for creating a rangeSlider
   **/
  function trimRange(values: number[]) {
    if (range === 'min' || range === 'max') {
      return values.slice(0, 1);
    } else if (range) {
      return values.slice(0, 2);
    } else {
      return values;
    }
  }

  /**
   * helper to return closest handle to user interaction
   * @param {object} clientPos the client {x,y} positions to check against
   * @return {number} the index of the closest handle to clientPos
   **/
  function getClosestHandle(clientPos: NormalisedClient) {
    if (!slider) return 0;

    // get the location of the interaction on the slider as a value
    const { pointerVal: clickedVal } = calculatePointerValues(slider, clientPos, vertical, reversed, min, max);

    let closest = 0;
    if (range === true && values[0] === values[1]) {
      // if we have a range, and the handles are at the same
      // position, we want a simple check if the interaction
      // value is greater than return the second handle
      if (clickedVal > values[1]) {
        closest = 1;
      } else {
        closest = 0;
      }
    } else {
      // if there are multiple handles, and not a range, then
      // we sort the handles values, and return the first one closest
      // to the interaction value
      closest = values.indexOf([...values].sort((a, b) => Math.abs(clickedVal - a) - Math.abs(clickedVal - b))[0]);
    }
    return closest;
  }

  /**
   * take the interaction position on the slider, convert
   * it to a value on the range, and then send that value
   * through to the moveHandle() method to set the active
   * handle's position
   * @param {object} clientPos the client {x,y} of the interaction
   **/
  function handleInteract(clientPos: NormalisedClient) {
    if (!slider || !handleActivated) return;
    // get the location of the interaction on the slider as a value
    const { pointerVal: handleVal } = calculatePointerValues(slider, clientPos, vertical, reversed, min, max);
    // move handle to the value
    moveHandle(activeHandle, handleVal);
  }

  /**
   * save the distance between the handles and the interaction position
   * when the user first starts dragging the range
   * @param {object} clientPos the client {x,y} of the interaction
   */
  function getRangeDistancesOnInteractionStart(clientPos: NormalisedClient) {
    if (!slider || !draggy || !rangeActivated || range === 'min' || range === 'max') return;
    // get the location of the interaction on the slider as a value
    const { pointerVal } = calculatePointerValues(slider, clientPos, vertical, reversed, min, max);
    // store the distances for later use
    rangeDistancesFromPointer = [values[0] - pointerVal, values[1] - pointerVal];
  }

  /**
   * take the interaction position on the slider, get the values of each handle
   * then calculate the distance between the handles and the interaction position
   * so when the user moves the range, each handle moves in the corresponding direction
   * at the original distance from the interaction position
   * @param {object} clientPos the client {x,y} of the interaction
   */
  function rangeInteract(clientPos: NormalisedClient) {
    if (!slider || !draggy || !rangeActivated || range === 'min' || range === 'max') return;
    // get the location of the interaction on the slider as a value
    const { pointerVal } = calculatePointerValues(slider, clientPos, vertical, reversed, min, max);
    // if dragging the range, we dont want to 'activate' a handle
    activeHandle = -1;
    // move the handles
    moveHandle(0, pointerVal + rangeDistancesFromPointer[0], false);
    moveHandle(1, pointerVal + rangeDistancesFromPointer[1], true);
  }

  /**
   * move a handle to a specific value, respecting the clamp/align rules
   * @param {number} index the index of the handle we want to move
   * @param {number} value the value to move the handle to
   * @param {boolean} fireEvent whether to fire the change event
   * @return {number} the value that was moved to (after alignment/clamping)
   **/
  function moveHandle(index: number | null, value: number, fireEvent: boolean = true) {
    // align & clamp the value so we're not doing extra
    // calculation on an out-of-range value down below
    value = constrainAndAlignValue(value, min, max, step, precision, limits);
    // use the active handle if handle index is not provided
    if (index === null) {
      index = activeHandle;
    }
    // if this is a range slider perform special checks
    if (range === true) {
      // restrict the handles of a range-slider from
      // going past one-another unless "pushy" is true
      if (index === 0) {
        if (value > values[1] - rangeGapMin) {
          if (pushy && value <= (limits?.[1] ?? max) - rangeGapMin) {
            values[1] = value + rangeGapMin;
          } else {
            value = values[1] - rangeGapMin;
          }
        } else if (value < values[1] - rangeGapMax) {
          if (pushy) {
            values[1] = value + rangeGapMax;
          } else {
            value = values[1] - rangeGapMax;
          }
        }
      } else if (index === 1) {
        if (value < values[0] + rangeGapMin) {
          if (pushy && value >= (limits?.[0] ?? min) + rangeGapMin) {
            values[0] = value - rangeGapMin;
          } else {
            value = values[0] + rangeGapMin;
          }
        } else if (value > values[0] + rangeGapMax) {
          if (pushy) {
            values[0] = value - rangeGapMax;
          } else {
            value = values[0] + rangeGapMax;
          }
        }
      }
    }

    // if the value has changed, update it
    if (values[index] !== value) {
      values[index] = constrainAndAlignValue(value, min, max, step, precision, limits);
    }
    if (fireEvent) {
      fireChangeEvent(values);
    }
    return value;
  }

  /**
   *
   */
  function fireChangeEvent(values: number[]) {
    // Check if any value has changed by comparing each element
    const hasChanged = previousValues.some((prev, index) => {
      return prev !== values[index];
    });

    if (hasChanged) {
      eChange();
      previousValues = [...values];
    }
  }

  /**
   * helper to find the beginning range value for use with css style
   * @param {array} values the input values for the rangeSlider
   * @return {number} the beginning of the range as a percentage of the total range
   **/
  function rangeStartPercent(values: number[]) {
    if (range === 'min') {
      return 0;
    } else {
      return values[0];
    }
  }

  /**
   * helper to find the ending range value for use with css style
   * @param {array} values the input values for the rangeSlider
   * @return {number} the end of the range as a percentage of the total range
   **/
  function rangeEndPercent(values: number[]) {
    if (range === 'max') {
      return 100;
    } else if (range === 'min') {
      return values[0];
    } else {
      return values[1];
    }
  }

  /**
   * when the user has unfocussed (blurred) from the
   * slider, deactivate all handles
   * @param {FocusEvent} event the event from browser
   **/
  function sliderBlurHandle(event: FocusEvent) {
    const target = event.target as HTMLSpanElement;
    if (keyboardActive) {
      focus = false;
      handleActivated = false;
      handlePressed = false;
      rangeActivated = false;
      rangePressed = false;
    }
  }

  /**
   * when the user focusses the handle of a slider
   * set it to be active
   * @param {FocusEvent} event the event from browser
   **/
  function sliderFocusHandle(event: FocusEvent) {
    const target = event.target as HTMLSpanElement;
    if (!disabled) {
      activeHandle = elementIndex(target);
      focus = true;
    }
  }

  /**
   * handle the keyboard accessible features by checking the
   * input type, and modfier key then moving handle by appropriate amount
   * @param {KeyboardEvent} event the event from browser
   **/
  function sliderKeydown(event: KeyboardEvent) {
    if (!disabled) {
      let prevent = false;
      const handle = elementIndex(event.target as HTMLSpanElement);
      let jump = step;
      if (event.ctrlKey || event.metaKey) {
        // Move by 1% of the total range, but ensure it's aligned to step
        const onePercent = (max - min) / 100;
        jump = Math.max(step, Math.round(onePercent / step) * step);
      } else if (event.shiftKey || event.key === 'PageUp' || event.key === 'PageDown') {
        // Move by 10% of the total range, but ensure it's aligned to step
        const tenPercent = (max - min) / 10;
        jump = Math.max(step, Math.round(tenPercent / step) * step);
      }

      switch (event.key) {
        case 'PageUp':
        case 'ArrowRight':
        case 'ArrowUp':
          moveHandle(handle, values[handle] + jump);
          prevent = true;
          break;
        case 'PageDown':
        case 'ArrowLeft':
        case 'ArrowDown':
          moveHandle(handle, values[handle] - jump);
          prevent = true;
          break;
        case 'Home':
          moveHandle(handle, min);
          prevent = true;
          break;
        case 'End':
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

  /**
   * function to run when the user touches
   * down on the slider element anywhere
   * @param {MouseEvent | TouchEvent} event the event from browser
   **/
  function sliderInteractStart(event: MouseEvent | TouchEvent) {
    if (!disabled) {
      const target = event.target as Element;
      const clientPos = normalisedClient(event);
      // set the closest handle as active
      focus = true;

      if (target.matches('.rangeBar') && range === true && draggy) {
        handleActivated = false;
        handlePressed = false;
        activeHandle = -1;
        rangeActivated = true;
        rangePressed = true;
        getRangeDistancesOnInteractionStart(clientPos);
      } else {
        handleActivated = true;
        handlePressed = true;
        activeHandle = getClosestHandle(clientPos);
        // for touch devices we want the handle to instantly
        // move to the position touched for more responsive feeling
        if (event.type === 'touchstart' && !target.matches('.rsPipVal')) {
          handleInteract(clientPos);
        }
      }
      // fire the start event
      startValues = values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits));
      previousValues = [...startValues];
      eStart();
    }
  }

  /**
   * function to run when the user stops touching
   * down on the slider element anywhere
   * @param {event} e the event from browser
   **/
  function sliderInteractEnd(event: MouseEvent | TouchEvent) {
    // fire the stop event for touch devices
    if (event.type === 'touchend') {
      eStop();
    }
    handlePressed = false;
    rangePressed = false;
  }

  /**
   * unfocus the slider if the user clicked off of
   * it, somewhere else on the screen
   * @param {MouseEvent | TouchEvent} event the event from browser
   **/
  function bodyInteractStart(event: MouseEvent | TouchEvent) {
    const target = event.target as Element;
    keyboardActive = false;
    if (slider && focus && target !== slider && !slider.contains(target)) {
      focus = false;
    }
  }

  /**
   * send the clientX through to handle the interaction
   * whenever the user moves acros screen while active
   * @param {MouseEvent | TouchEvent} event the event from browser
   **/
  function bodyInteract(event: MouseEvent | TouchEvent) {
    if (!disabled) {
      if (handleActivated) {
        handleInteract(normalisedClient(event));
      } else if (rangeActivated) {
        rangeInteract(normalisedClient(event));
      }
    }
  }

  /**
   * if user triggers mouseup on the body while
   * a handle is active (without moving) then we
   * trigger an interact event there
   * @param {event} event the event from browser
   **/
  function bodyMouseUp(event: MouseEvent) {
    if (!disabled) {
      const target = event.target as Element;
      // this only works if a handle is active, which can
      // only happen if there was sliderInteractStart triggered
      // on the slider, already
      if (handleActivated) {
        if (slider && (target === slider || slider.contains(target))) {
          focus = true;
          // don't trigger interact if the target is a handle (no need) or
          // if the target is a label (we want to move to that value from rangePips)
          if (!targetIsHandle(target) && !target.matches('.rsPipVal')) {
            handleInteract(normalisedClient(event));
          }
        }
      }
      if (handleActivated || rangeActivated) {
        // fire the stop event for mouse device
        // when the body is triggered with an active handle/range
        eStop();
      }
    }
    handleActivated = false;
    handlePressed = false;
    rangeActivated = false;
    rangePressed = false;
  }

  /**
   * if user triggers touchend on the body then we
   * defocus the slider completely
   * @param {event} event the event from browser
   **/
  function bodyTouchEnd(event: TouchEvent) {
    handleActivated = false;
    handlePressed = false;
    rangeActivated = false;
    rangePressed = false;
  }

  function bodyKeyDown(event: KeyboardEvent) {
    const target = event.target as Element;
    if (!disabled && slider) {
      if (target === slider || slider.contains(target)) {
        keyboardActive = true;
      }
    }
  }

  function eStart() {
    if (disabled) return;
    dispatch('start', {
      activeHandle,
      value: startValues[activeHandle],
      values: startValues
    });
  }

  function eStop() {
    if (disabled) return;
    const startValue = rangeActivated ? startValues : startValues[activeHandle];
    dispatch('stop', {
      activeHandle,
      startValue,
      value: values[activeHandle],
      values: values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits))
    });
  }

  function eChange() {
    if (disabled) return;
    const startValue = rangeActivated ? startValues : startValues[activeHandle];
    const previousValue =
      typeof previousValues === 'undefined'
        ? startValue
        : rangeActivated
          ? previousValues
          : previousValues[activeHandle];
    dispatch('change', {
      activeHandle,
      startValue,
      previousValue,
      value: values[activeHandle],
      values: values.map((v) => constrainAndAlignValue(v, min, max, step, precision, limits))
    });
  }

  function ariaLabelFormatter(value: number, index: number) {
    const percent = valueAsPercent(value, min, max, precision);
    const formattedValue = handleFormatter(value, index, percent);
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
  style:--slider-length={sliderSize}
  {style}
  on:mousedown={sliderInteractStart}
  on:mouseup={sliderInteractEnd}
  on:touchstart|preventDefault={sliderInteractStart}
  on:touchend|preventDefault={sliderInteractEnd}
>
  {#each values as value, index}
    {@const zindex = `${focus && activeHandle === index ? 3 : ''}`}
    {@const translate = `calc((${sliderSize}px * ${$springPositions[index] / 100}))`}
    <span
      role="slider"
      class="rangeHandle"
      class:rsActive={focus && activeHandle === index}
      class:rsPress={handlePressed && activeHandle === index}
      data-handle={index}
      on:blur={sliderBlurHandle}
      on:focus={sliderFocusHandle}
      on:keydown={sliderKeydown}
      style:z-index={zindex}
      style:--handle-pos={$springPositions[index]}
      aria-label={ariaLabels[index]}
      aria-valuemin={range === true && index === 1 ? values[0] : min}
      aria-valuemax={range === true && index === 0 ? values[1] : max}
      aria-valuenow={value}
      aria-valuetext={ariaLabelFormatter(value, index)}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      aria-disabled={disabled}
      tabindex={disabled ? -1 : 0}
    >
      <span class="rangeNub"></span>
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
    ></span>
  {/if}
  {#if hasRange}
    <span
      class="rangeBar"
      class:rsPress={rangePressed}
      style:--range-start={rangeStartPercent($springPositions)}
      style:--range-end={rangeEndPercent($springPositions)}
      style:--range-size={rangeEndPercent($springPositions) - rangeStartPercent($springPositions)}
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

  @layer base {
    :global(.rangeSlider) {
      --slider-accent: #4a40d4;
      --slider-accent-100: #838de7;
      --slider-base: #99a2a2;
      --slider-base-100: #aebecf;
      --slider-base-200: #b9c2c2;
      --slider-bg: #d7dada;
      --slider-fg: #3f3e4f;

      --slider-dark-accent: #6070fc;
      --slider-dark-accent-100: #7a7fab;
      --slider-dark-base: #82809f;
      --slider-dark-base-100: #595970;
      --slider-dark-base-200: #454454;
      --slider-dark-bg: #3f3e4f;
      --slider-dark-fg: #d7dada;

      --slider: var(--range-slider, var(--slider-bg));
      --handle-inactive: var(--range-handle-inactive, var(--slider-base));
      --handle: var(--range-handle, var(--slider-accent-100));
      --handle-focus: var(--range-handle-focus, var(--slider-accent));
      --handle-border: var(--range-handle-border, var(--handle));
      --range-inactive: var(--range-range-inactive, var(--handle-inactive));
      --range: var(--range-range, var(--handle-focus));
      --range-limit: var(--range-range-limit, var(--slider-base-200));
      --range-hover: var(--range-range-hover, var(--handle-border));
      --range-press: var(--range-range-press, var(--handle-border));
      --float-inactive: var(--range-float-inactive, var(--handle-inactive));
      --float: var(--range-float, var(--handle-focus));
      --float-text: var(--range-float-text, white);
    }

    :global(.rangeSlider.dark) {
      --slider-accent: var(--slider-dark-accent);
      --slider-accent-100: var(--slider-dark-accent-100);
      --slider-base: var(--slider-dark-base);
      --slider-base-100: var(--slider-dark-base-100);
      --slider-base-200: var(--slider-dark-base-200);
      --slider-bg: var(--slider-dark-bg);
      --slider-fg: var(--slider-dark-fg);
    }

    @media (prefers-color-scheme: dark) {
      :global(.rangeSlider) {
        --slider-accent: var(--slider-dark-accent);
        --slider-accent-100: var(--slider-dark-accent-100);
        --slider-base: var(--slider-dark-base);
        --slider-base-100: var(--slider-dark-base-100);
        --slider-base-200: var(--slider-dark-base-200);
        --slider-bg: var(--slider-dark-bg);
        --slider-fg: var(--slider-dark-fg);
      }
    }
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
    translate: calc(var(--slider-length) * (var(--handle-pos) / 100) * 1px) 0;
    z-index: 2;
  }

  :global(.rangeSlider.rsReversed .rangeHandle) {
    transform: translateY(-50%) translateX(-50%);
    translate: calc((var(--slider-length) * 1px) - (var(--slider-length) * (var(--handle-pos) / 100) * 1px)) 0;
  }

  :global(.rangeSlider.rsVertical .rangeHandle) {
    left: 0.25em;
    top: auto;
    transform: translateY(-50%) translateX(-50%);
    translate: 0 calc(var(--slider-length) * (1 - var(--handle-pos) / 100) * 1px);
  }

  :global(.rangeSlider.rsVertical.rsReversed .rangeHandle) {
    transform: translateY(-50%) translateX(-50%);
    translate: 0 calc((var(--slider-length) * 1px) - (var(--slider-length) * (1 - var(--handle-pos) / 100) * 1px));
  }

  :global(.rangeSlider .rangeNub),
  :global(.rangeSlider .rangeHandle::before) {
    position: absolute;
    left: 0;
    top: 0;
    display: block;
    border-radius: 10em;
    height: 100%;
    width: 100%;
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;
  }

  :global(.rangeSlider .rangeHandle::before) {
    content: '';
    left: 1px;
    top: 1px;
    bottom: 1px;
    right: 1px;
    height: auto;
    width: auto;
    box-shadow: 0 0 0 0px var(--handle-border);
    opacity: 0;
    transition:
      opacity 0.2s ease,
      box-shadow 0.2s ease;
  }

  :global(.rangeSlider.rsHoverable:not(.rsDisabled) .rangeHandle:hover::before) {
    box-shadow: 0 0 0 8px var(--handle-border);
    opacity: 0.2;
  }

  :global(.rangeSlider.rsHoverable:not(.rsDisabled) .rangeHandle.rsPress::before),
  :global(.rangeSlider.rsHoverable:not(.rsDisabled) .rangeHandle.rsPress:hover::before) {
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
    font-size: 1em;
    text-align: center;
    pointer-events: none;
    white-space: nowrap;
    font-size: 0.9em;
    line-height: 1;
    padding: 0.33em 0.5em 0.5em;
    border-radius: 0.5em;
    z-index: 3;
    opacity: 0;
    translate: -50% -50% 0.01px;
    scale: 1;
    transform-origin: center;
    transition: all 0.22s cubic-bezier(0.33, 1, 0.68, 1);
  }

  :global(.rangeSlider .rangeHandle.rsActive .rangeFloat),
  :global(.rangeSlider.rsHoverable .rangeHandle:hover .rangeFloat),
  :global(.rangeSlider.rsHoverable .rangeBar:hover .rangeFloat),
  :global(.rangeSlider.rsFocus .rangeBar .rangeFloat) {
    opacity: 1;
    scale: 1;
    translate: -50% 0% 0.01px;
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
    translate: -50% -50% 0.01px;
  }

  :global(.rangeSlider.rsVertical .rangeHandle.rsActive .rangeFloat),
  :global(.rangeSlider.rsVertical.rsHoverable .rangeHandle:hover .rangeFloat),
  :global(.rangeSlider.rsVertical.rsHoverable .rangeBar:hover .rangeFloat),
  :global(.rangeSlider.rsVertical.rsFocus .rangeBar .rangeFloat) {
    translate: 0% -50% 0.01px;
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

  :global(.rangeSlider .rangeBar) {
    translate: calc((var(--slider-length) * (var(--range-start) / 100) * 1px)) 0;
    width: calc(var(--slider-length) * (var(--range-size) / 100 * 1px));
  }
  :global(.rangeSlider.rsReversed .rangeBar) {
    translate: calc((var(--slider-length) * 1px) - (var(--slider-length) * (var(--range-end) / 100) * 1px)) 0;
  }

  :global(.rangeSlider.rsVertical .rangeBar) {
    translate: 0 calc((var(--slider-length) * 1px) - (var(--slider-length) * (var(--range-end) / 100) * 1px));
    height: calc(var(--slider-length) * (var(--range-size) / 100 * 1px));
  }

  :global(.rangeSlider.rsVertical.rsReversed .rangeBar) {
    translate: 0 calc((var(--slider-length) * (var(--range-start) / 100) * 1px));
  }

  :global(.rangeSlider.rsDrag .rangeBar::before) {
    content: '';
    inset: 0;
    top: -0.5em;
    bottom: -0.5em;
    height: auto;
    background-color: var(--range-hover);
    opacity: 0;
    scale: 1 0.5;
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
    scale: 1 1;
  }

  :global(.rangeSlider.rsHoverable:not(.rsDisabled).rsDrag .rangeBar.rsPress::before) {
    opacity: 0.4;
    scale: 1 1.25;
  }

  :global(.rangeSlider.rsVertical.rsHoverable:not(.rsDisabled).rsDrag .rangeBar.rsPress::before) {
    scale: 1.25 1;
  }

  :global(.rangeSlider) {
    background-color: var(--slider);
  }

  :global(.rangeSlider .rangeBar) {
    background-color: var(--range-inactive);
  }

  :global(.rangeSlider.rsFocus .rangeBar) {
    background-color: var(--range);
  }

  :global(.rangeSlider .rangeLimit) {
    background-color: var(--range-limit);
  }

  :global(.rangeSlider .rangeNub) {
    background-color: var(--handle-inactive);
  }

  :global(.rangeSlider.rsFocus .rangeNub) {
    background-color: var(--handle);
  }

  :global(.rangeSlider .rangeHandle.rsActive .rangeNub) {
    background-color: var(--handle-focus);
  }

  :global(.rangeSlider .rangeFloat) {
    color: var(--float-text);
    background-color: var(--float-inactive);
  }

  :global(.rangeSlider.rsFocus .rangeFloat) {
    background-color: var(--float);
  }

  :global(.rangeSlider.rsDisabled) {
    opacity: 0.5;
  }

  :global(.rangeSlider.rsDisabled .rangeNub) {
    background-color: var(--handle-inactive);
  }
</style>
