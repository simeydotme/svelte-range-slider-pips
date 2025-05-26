/**
 * check if the value is a finite number
 * @param value the value to check
 * @returns true if the value is a finite number
 */
export function isFiniteNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}
/**
 * make sure the value is coerced to a float value
 * @param {number|string} value the value to fix
 * @param {number} precision the number of decimal places to fix to
 * @return {number} a float version of the input
 **/
export const coerceFloat = (value, precision = 2) => {
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
export const clampValue = function (value, min, max) {
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
export const valueAsPercent = function (value, min, max, precision = 2) {
    let percent = ((value - min) / (max - min)) * 100;
    if (isNaN(percent) || percent <= 0) {
        return 0;
    }
    else if (percent >= 100) {
        return 100;
    }
    else {
        return coerceFloat(percent, precision);
    }
};
/**
 * convert a percentage to a value
 * @param {number} percent the percentage to convert
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @return {number} the value after it's been converted
 **/
export const percentAsValue = function (percent, min, max) {
    return ((max - min) / 100) * percent + min;
};
/**
 * align the value with the steps so that it
 * always sits on the closest (above/below) step
 * @param {number} value the value to align
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @param {number} step the step value
 * @param {number} precision the number of decimal places to fix to
 * @param {number[]} limits the limits to check against
 * @return {number} the value after it's been aligned
 **/
export const constrainAndAlignValue = function (value, min, max, step, precision = 2, limits = null) {
    // if limits are provided, clamp the value between the limits
    // if no limits are provided, clamp the value between the min and max
    // before we start aligning the value
    value = clampValue(value, limits?.[0] ?? min, limits?.[1] ?? max);
    // escape early if the value is at/beyond the known limits
    if (limits?.[0] && value <= limits[0]) {
        return limits?.[0];
    }
    else if (limits?.[1] && value >= limits[1]) {
        return limits?.[1];
    }
    else if (max && value >= max) {
        return max;
    }
    else if (min && value <= min) {
        return min;
    }
    // find the middle-point between steps
    // and see if the value is closer to the
    // next step, or previous step
    let remainder = (value - min) % step;
    let aligned = value - remainder;
    if (Math.abs(remainder) * 2 >= step) {
        aligned += remainder > 0 ? step : -step;
    }
    else if (value >= max - remainder) {
        aligned = max;
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
export const pureText = (possibleHtml = '') => {
    return `${possibleHtml}`.replace(/<[^>]*>/g, '');
};
/**
 * normalise a mouse or touch event to return the
 * client (x/y) object for that event
 * @param {event} event a mouse/touch event to normalise
 * @returns {object} normalised event client object (x,y)
 **/
export const normalisedClient = (event) => {
    const { clientX, clientY } = 'touches' in event ? event.touches[0] || event.changedTouches[0] : event;
    return { x: clientX, y: clientY };
};
/**
 * helper func to get the index of an element in it's DOM container
 * @param {Element} el dom object reference we want the index of
 * @returns {number} the index of the input element
 **/
export const elementIndex = (el) => {
    if (!el)
        return -1;
    var i = 0;
    while ((el = el.previousElementSibling)) {
        i++;
    }
    return i;
};
/**
 * helper to check if the given value is inside the range
 * @param value the value to check
 * @param range the range of values to check against
 * @param type the type of range to check against
 * @returns {boolean} true if the value is in the range
 */
export const isInRange = (value, range, type) => {
    if (type === 'min') {
        // if the range is 'min', then we're checking if the value is above the min value
        return range[0] > value;
    }
    else if (type === 'max') {
        // if the range is 'max', then we're checking if the value is below the max value
        return range[0] < value;
    }
    else if (type) {
        // if the range is a boolean of true, then we're checking if the value is in the range
        return range[0] < value && range[1] > value;
    }
};
/**
 * helper to check if the given value is outside of the limits
 * @param value the value to check
 * @param limits the limits to check against
 * @returns {boolean} true if the value is out of the limits
 */
export const isOutOfLimit = (value, limits) => {
    if (!limits)
        return false;
    return value < limits[0] || value > limits[1];
};
/**
 * helper to check if the given value is selected
 * @param value the value to check if is selected
 * @param values the values to check against
 * @param precision the precision to check against
 * @returns {boolean} true if the value is selected
 */
export const isSelected = (value, values, precision = 2) => {
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
export const getValueFromIndex = (index, min, max, pipStep, step, precision = 2) => {
    return coerceFloat(min + index * step * pipStep, precision);
};
/**
 * Calculate pointer position, percentage and value for a slider interaction
 * @param clientPos The normalized client position (x,y)
 * @param dims The slider's bounding rectangle dimensions
 * @param vertical Whether the slider is vertical
 * @param reversed Whether the slider is reversed
 * @param min The minimum value of the slider
 * @param max The maximum value of the slider
 * @returns Object containing pointer position, percentage and value
 */
export const calculatePointerValues = (slider, clientPos, vertical, reversed, min, max) => {
    // first make sure we have the latest dimensions
    // of the slider, as it may have changed size
    const dims = slider.getBoundingClientRect();
    // calculate the interaction position, percent and value
    let pointerPos = 0;
    let pointerPercent = 0;
    let pointerVal = 0;
    if (vertical) {
        pointerPos = clientPos.y - dims.top;
        pointerPercent = (pointerPos / dims.height) * 100;
        pointerPercent = reversed ? pointerPercent : 100 - pointerPercent;
    }
    else {
        pointerPos = clientPos.x - dims.left;
        pointerPercent = (pointerPos / dims.width) * 100;
        pointerPercent = reversed ? 100 - pointerPercent : pointerPercent;
    }
    pointerVal = percentAsValue(pointerPercent, min, max);
    return { pointerVal, pointerPercent };
};
