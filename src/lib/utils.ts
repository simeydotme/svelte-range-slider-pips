import type { NormalisedClient } from './types.js';

/**
 * make sure the value is coerced to a float value
 * @param {number|string} value the value to fix
 * @param {number} precision the number of decimal places to fix to
 * @return {number} a float version of the input
 **/
export const coerceFloat = (value: number | string, precision: number = 2) => {
  return parseFloat((+value).toFixed(precision));
};

/**
 * clamp a value from a range so that it always
 * falls within the min/max values
 * @param {number} value the value to clamp
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @return {number} the value after it's been clamped
 **/
export const clampValue = function (value: number, min: number, max: number) {
  // return the min/max if outside of that range
  return value <= min ? min : value >= max ? max : value;
};

/**
 * take in a value, and then calculate that value's percentage
 * of the overall range (min-max);
 * @param {number} value the value we're getting percent for
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @param {number} precision the number of decimal places to fix to (default 2)
 * @return {number} the percentage value
 **/
export const valueAsPercent = function (
  value: number,
  min: number,
  max: number,
  precision: number = 2
) {
  let percent = ((value - min) / (max - min)) * 100;
  if (isNaN(percent) || percent <= 0) {
    return 0;
  } else if (percent >= 100) {
    return 100;
  } else {
    return coerceFloat(percent, precision);
  }
};

/**
 * align the value with the steps so that it
 * always sits on the closest (above/below) step
 * @param {number} value the value to align
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @param {number} step the step value
 * @param {number} precision the number of decimal places to fix to
 * @return {number} the value after it's been aligned
 **/
export const alignValueToStep = function (
  value: number,
  min: number,
  max: number,
  step: number,
  precision: number = 2,
  limits: [number, number] | null = null
) {
  // if limits are provided, clamp the value between the limits
  // if no limits are provided, clamp the value between the min and max
  value = clampValue(value, limits?.[0] ?? min, limits?.[1] ?? max);

  // find the middle-point between steps
  // and see if the value is closer to the
  // next step, or previous step
  let remainder = (value - min) % step;
  let aligned = value - remainder;
  if (Math.abs(remainder) * 2 >= step) {
    aligned += remainder > 0 ? step : -step;
  }
  // make sure the value is within acceptable limits
  aligned = clampValue(aligned, limits?.[0] ?? min, limits?.[1] ?? max);
  // make sure the returned value is set to the precision desired
  // this is also because javascript often returns weird floats
  // when dealing with odd numbers and percentages
  return coerceFloat(aligned, precision);
};

/**
 * helper to take a string of html and return only the text
 * @param {string} possibleHtml the string that may contain html
 * @return {string} the text from the input
 */
export const pureText = (possibleHtml: string = '') => {
  return `${possibleHtml}`.replace(/<[^>]*>/g, '');
};

/**
 * normalise a mouse or touch event to return the
 * client (x/y) object for that event
 * @param {event} event a mouse/touch event to normalise
 * @returns {object} normalised event client object (x,y)
 **/
export const normalisedClient = (event: TouchEvent | MouseEvent) => {
  const { clientX, clientY } =
    'touches' in event ? event.touches[0] || event.changedTouches[0] : event;
  return { x: clientX, y: clientY } as NormalisedClient;
};

/**
 * helper func to get the index of an element in it's DOM container
 * @param {Element} el dom object reference we want the index of
 * @returns {number} the index of the input element
 **/
export const elementIndex = (el: Element | null) => {
  if (!el) return -1;
  var i = 0;
  while ((el = el.previousElementSibling)) {
    i++;
  }
  return i;
};

/**
 * helper to check if the given value is inside the range
 * @param value the value to check if is in the range
 * @param range the range of values to check against
 * @param type the type of range to check against
 * @returns {boolean} true if the value is in the range
 */
export const isInRange = (value: number, range: number[], type: string | boolean) => {
  if (type === 'min') {
    // if the range is 'min', then we're checking if the value is above the min value
    return range[0] > value;
  } else if (type === 'max') {
    // if the range is 'max', then we're checking if the value is below the max value
    return range[0] < value;
  } else if (type) {
    // if the range is a boolean of true, then we're checking if the value is in the range
    return range[0] < value && range[1] > value;
  }
};

export const isOutOfLimit = (value: number, limits: number[] | null) => {
  if (!limits) return false;
  return value < limits[0] || value > limits[1];
};

/**
 * helper to check if the given value is selected
 * @param value the value to check if is selected
 * @param values the values to check against
 * @param precision the precision to check against
 * @returns {boolean} true if the value is selected
 */
export const isSelected = (value: number, values: number[], precision: number = 2) => {
  return values.some((v) => coerceFloat(v, precision) === coerceFloat(value, precision));
};

/**
 * helper to return the value of a pip based on the index, and the min/max values,
 * and the step of the range slider
 * @param index  the index of the pip
 * @param min  the minimum value of the range slider
 * @param max the maximum value of the range slider
 * @param pipStep the step of the pips
 * @param step the step of the range slider
 * @param precision the precision to check against
 * @returns {number} the value of the pip
 */
export const getValueFromIndex = (
  index: number,
  min: number,
  max: number,
  pipStep: number,
  step: number,
  precision: number = 2
) => {
  return coerceFloat(min + index * step * pipStep, precision);
};
