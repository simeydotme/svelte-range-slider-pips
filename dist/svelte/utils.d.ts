import type { NormalisedClient } from './types.js';
/**
 * check if the value is a finite number
 * @param value the value to check
 * @returns true if the value is a finite number
 */
export declare function isFiniteNumber(value: number): value is number;
/**
 * make sure the value is coerced to a float value
 * @param {number|string} value the value to fix
 * @param {number} precision the number of decimal places to fix to
 * @return {number} a float version of the input
 **/
export declare const coerceFloat: (value: number | string, precision?: number) => number;
/**
 * clamp a value from a range so that it always
 * falls within the min/max values
 * @param {number} value the value to clamp
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @return {number} the value after it's been clamped
 **/
export declare const clampValue: (value: number, min: number, max: number) => number;
/**
 * take in a value, and then calculate that value's percentage
 * of the overall range (min-max);
 * @param {number} value the value we're getting percent for
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @param {number} precision the number of decimal places to fix to (default 2)
 * @return {number} the percentage value
 **/
export declare const valueAsPercent: (value: number, min: number, max: number, precision?: number) => number;
/**
 * convert a percentage to a value
 * @param {number} percent the percentage to convert
 * @param {number} min the minimum value
 * @param {number} max the maximum value
 * @return {number} the value after it's been converted
 **/
export declare const percentAsValue: (percent: number, min: number, max: number) => number;
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
export declare const constrainAndAlignValue: (value: number, min: number, max: number, step: number, precision?: number, limits?: [number, number] | null) => number;
/**
 * helper to take a string of html and return only the text
 * @param {string} possibleHtml the string that may contain html
 * @return {string} the text from the input
 */
export declare const pureText: (possibleHtml?: string) => string;
/**
 * normalise a mouse or touch event to return the
 * client (x/y) object for that event
 * @param {event} event a mouse/touch event to normalise
 * @returns {object} normalised event client object (x,y)
 **/
export declare const normalisedClient: (event: TouchEvent | MouseEvent) => NormalisedClient;
/**
 * helper func to get the index of an element in it's DOM container
 * @param {Element} el dom object reference we want the index of
 * @returns {number} the index of the input element
 **/
export declare const elementIndex: (el: Element | null) => number;
/**
 * helper to check if the given value is inside the range
 * @param value the value to check
 * @param range the range of values to check against
 * @param type the type of range to check against
 * @returns {boolean} true if the value is in the range
 */
export declare const isInRange: (value: number, range: number[], type: string | boolean) => boolean | undefined;
/**
 * helper to check if the given value is outside of the limits
 * @param value the value to check
 * @param limits the limits to check against
 * @returns {boolean} true if the value is out of the limits
 */
export declare const isOutOfLimit: (value: number, limits: number[] | null) => boolean;
/**
 * helper to check if the given value is selected
 * @param value the value to check if is selected
 * @param values the values to check against
 * @param precision the precision to check against
 * @returns {boolean} true if the value is selected
 */
export declare const isSelected: (value: number, values: number[], precision?: number) => boolean;
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
export declare const getValueFromIndex: (index: number, min: number, max: number, pipStep: number, step: number, precision?: number) => number;
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
export declare const calculatePointerValues: (slider: HTMLElement, clientPos: NormalisedClient, vertical: boolean, reversed: boolean, min: number, max: number) => {
    pointerVal: number;
    pointerPercent: number;
};
