<div align="center">

<img src="test/public/svelte-range-slider-logo.svg" 
  alt="Svelte Range Slider Logo" width="20%">
</div>

<h1 align="center">
  Svelte Range Slider (with pips)

  <p>
    <a href="https://github.com/simeydotme/svelte-range-slider-pips/releases">
      <img src="https://img.shields.io/github/package-json/v/simeydotme/svelte-range-slider-pips/main?label=&color=%234A40D4&logo=github" alt="Code Version">
    </a>
    <a href="https://www.npmjs.com/package/svelte-range-slider-pips">
      <img src="https://img.shields.io/npm/v/svelte-range-slider-pips?color=%234A40D4&logo=npm&label=" alt="NPM version">
      <img src="https://img.shields.io/npm/dm/svelte-range-slider-pips?label=&color=%234A40D4" alt="NPM Downloads / Month">
    </a>
  </p>
</h1>

A reactive, accessible, multi-thumb, range slider with the ability to display "pips" or "notches" along the range.   
Importable as a ***svelte-component***, or able to be **used directly in any javascript application / framework**.

![Svelte Range Slider; focussed with pips and labels prop set](test/public/svelte-range-slider-screenshot.png)



| 📔🔍 | Docs | [Full Documentation & Examples](https://simeydotme.github.io/svelte-range-slider-pips/) |
| :--: | -----: | :------ |
| 📝⚙ | **REPL** | **[Svelte component demo](https://svelte.dev/repl/030797781fd64ad88302d1343f5b2c43?version=3)** |
| ❤✒ | **Codepen** | **[Plain JS component demo](https://codepen.io/simeydotme/pen/KKNJdbK)** |

---

<br>

## Features

![Features of the range slider plugin (written below)](test/public/svelte-range-slider-features.png)

- ✨ fully customisable, stylable & accessible
- 👍🏽 multi-thumb
- 🎚 range (min/max)
- 🏷 floating labels
- 📏 ruler notches
- 🏷 labels for notches
- 🧮 step function
- 🖍 formatter
- 🎭 animated

## Install

Open your project and use the command line to install the package;

```bash
yarn add svelte-range-slider-pips --dev          # or
npm install svelte-range-slider-pips --save-dev  # if you prefer npm
```

## Usage

### In a svelte project

Assuming you have a Svelte app up and running;

```html
<script>
  import RangeSlider from "svelte-range-slider-pips";
</script>

<RangeSlider values={[50]} pips />
```

### As a regular JS file

If you're not building a svelte-app, you can use the [`/dist/`
version of the script `/dist/svelte-range-slider-pips.js`](dist/svelte-range-slider-pips.js) and include it
with a regular `<script>` tag. This should even work with jQuery.

```html
<script src="./js/vendor/svelte-range-slider-pips.js" />

<div id="my-slider"></div>

<script>
  var mySlider = new RangeSliderPips({
    target: document.querySelector("#my-slider"),
    props: { values: [50], pips: true }
  });
</script>
```

### As a JS module

If you're building a bleeding-edge JS application (maybe Vue or React), you might
want to use js imports (`import`)

```js
import RangeSlider from "./node_modules/svelte-range-slider-pips/dist/svelte-range-slider-pips.mjs";

var mySlider = new RangeSlider({
  target: node, // js reference to a DOM element
  props: { values: [50], pips: true }
});
```

---

<br>

## Props (options)

### Slider props

prop | type | default | description
-----|------|---------|-------------
**values** | `Array` | `[50]` | Array of values to apply on the slider. Multiple values creates multiple handles. (_**note:** A slider with `range` property set can only have two values max_)
**min** | `Number` | `0` | Minimum value for the slider _(should be `< max`)_
**max** | `Number` | `100` | Maximum value for the slider _(should be `> min`)_
**step** | `Number` | `1` | Every `nth` value to allow handle to stop at _(should be a positive value)_
**range** | `Boolean`/`String` | `false` | Whether to style as a range picker. Use `range='min'` or `range='max'` for min/max variants
**pushy** | `Boolean` | `false` | If `range` is `true`, then this boolean decides if one handle will push the other along
**float** | `Boolean` | `false` | Set true to add a floating label above focussed handles
**vertical** | `Boolean` | `false` | Make the slider render vertically (lower value on bottom)
**pips** | `Boolean` | `false` | Whether to show pips/notches on the slider
**pipstep** | `Number` | `1`/`10`/`20` | Every `nth` step to show a pip for. This has multiple defaults depending on `values` property
**first** | `Boolean`/`String` | `false` | Whether to show a pip or label for the first value on slider. Use `first='label'` to show a label value
**last** | `Boolean`/`String` | `false` | Whether to show a pip or label for the last value on slider. Use `last='label'` to show a label value
**rest** | `Boolean`/`String` | `false` | Whether to show a pip or label for all other values. Use `rest='label'` to show a label value
**all** | `Boolean`/`String` | `false` | Whether to show a pip or label for all values. Same as combining `first`, `last` and `rest`. Use `all='label'` to show a label value
**prefix** | `String` | `""` | A string to prefix to all displayed values
**suffix** | `String` | `""` | A string to suffix to all displayed values
**reversed** | `Boolean` | `false` | Reverse the orientation of min/max
**hoverable** | `Boolean` | `true` | Whether hover styles are enabled for both handles and pips/values
**disabled** | `Boolean` | `false` | Determine if the slider is disabled, or enabled _(only disables interactions, and events)_
**id** | `String` | `""` | Give the slider a unique ID for use in styling
**ariaLabels** | `Array` | `[]` | Array of strings to use for the `aria-label` attribute on the handles.
**formatter** | `Function` | `(v,i,p) => v` | A function to re-format values before they are displayed (`v = value, i = pip index, p = percent`)
**handleFormatter** | `Function` | `formatter` | A function to re-format values on the handle/float before they are displayed. Defaults to the same function given to the `formatter` property (`v = value, i = handle index, p = percent`)
**springValues** | `Object` | `{ stiffness: 0.15, damping: 0.4 }` | Svelte spring physics object to change the behaviour of the handle when moving
**slider** | `Element` | `undefined` | DOM reference for binding to the main `<div />` of the component (`bind:slider='ref'`)

**[📔🔍 | Documentation for Options](https://simeydotme.github.io/svelte-range-slider-pips/en/options/)**
<br>
<br>

### Slider events (dispatched)

event | example | `event.detail` | description
------|------------|--------|-------------
**start** | `on:start={(e) => { ... }}` | `{ activeHandle: Integer, value: Float, values: Array }` | Event fired when the user begins interaction with the slider
**change** | `on:change={(e) => { ... }}` | `{ activeHandle: Integer, startValue: Float, previousValue: Float, value: Float, values: Array }` | Event fired when the user changes the value; returns the previous value, also
**stop** | `on:stop={(e) => { ... }}` | `{ activeHandle: Integer, startValue: Float, value: Float, values: Array }` | Event fired when the user stops interacting with slider; returns the beginning value, also

**[📔🔍 | Documentation for Events](https://simeydotme.github.io/svelte-range-slider-pips/en/events/)**

<br>
<br>

## Styling

**Styling should mostly be done with CSS.**  
There's a [bunch of css variables for controlling the colors](https://simeydotme.github.io/svelte-range-slider-pips/#styling) of the elements. 
And the slider is fluid horizontally, with the size of things controlled by font-size. So you may change the `font-size` on the `.rangeSlider` base
element to change the scale of everything.

If you require more fine control of the widths, heights, etc, then you may override the default css. This can be easier by using the `id` prop
to give your slider a unique id.

Values of labels can be styled with CSS, and the format can be modified with the `formatter()` function prop. And animation of the handles is
controlled by the `springValues` object prop.

**[📔🔍 | Documentation for Styling](https://simeydotme.github.io/svelte-range-slider-pips/en/styling/)**

<br>
<br>

## Contribute

I am very happy to accept;

- 🌟 suggestions/requests for new features or changes
- 🛠 pull-requests for bug fixes, or issue resolution
- 🧪 help with creating a proper test-suite

[Read the CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Support / Donate  
I'd be super excited if you find this project useful and wish to donate a small amount for my efforts!

| <img src="https://user-images.githubusercontent.com/2817396/149629283-6002944f-9253-4e35-917d-89b476deae4e.png" width=20> | [![£1 One Pound Donation](https://user-images.githubusercontent.com/2817396/149629980-08b9a952-bd6a-4c23-be78-05e3fd534352.png)](https://www.paypal.com/paypalme/simey/1) | [£1 GBP donation](https://www.paypal.com/paypalme/simey/1) |
|--|--:|---------|
| <img src="https://user-images.githubusercontent.com/2817396/149629283-6002944f-9253-4e35-917d-89b476deae4e.png" width=20> | [![£5 Five Pounds Donation](https://user-images.githubusercontent.com/2817396/149629994-3a99770c-d333-46e7-9818-ab6b18ad0202.png)](https://www.paypal.com/paypalme/simey/5) | [£5 GBP donation](https://www.paypal.com/paypalme/simey/5) |
| <img src="https://user-images.githubusercontent.com/2817396/149629283-6002944f-9253-4e35-917d-89b476deae4e.png" width=20> | [![£10 Ten Pounds Donation](https://user-images.githubusercontent.com/2817396/149630000-95aa4234-ff67-4e7c-a7f4-ffd52f25e6d8.png)](https://www.paypal.com/paypalme/simey/10) | [£10 GBP donation](https://www.paypal.com/paypalme/simey/10) |
