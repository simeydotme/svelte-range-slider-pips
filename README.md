<div align="center">

<img src="public/svelte-range-slider-logo.svg" 
    alt="Svelte Range Slider Logo" width="20%">

  <h1 align="center">
    Svelte Range Slider v3
  </h1>

  <p>
    <a href="https://github.com/simeydotme/svelte-range-slider-pips/releases">
      <img src="https://img.shields.io/github/package-json/v/simeydotme/svelte-range-slider-pips/main?label=&color=%234A40D4&logo=github" alt="Code Version">
    </a>
    <a href="https://www.npmjs.com/package/svelte-range-slider-pips">
      <img src="https://img.shields.io/npm/v/svelte-range-slider-pips?color=%234A40D4&logo=npm&label=" alt="NPM version">
      <img src="https://img.shields.io/npm/dm/svelte-range-slider-pips?label=&color=%234A40D4" alt="NPM Downloads / Month">
    </a>
  </p>

A reactive, accessible, multi-thumb, range slider with the ability to display "pips" or "notches" along the range.  
 Importable as a **_svelte-component_**, or able to be **used directly in any javascript application / framework**.

 <img height="32" src="./public/icons/svelte-svgrepo-com.png" alt="Svelte Icon">
 <img height="32" src="./public/icons/vuejs-svgrepo-com.png" alt="Vue Icon">
 <img height="32" src="./public/icons/react-svgrepo-com.png" alt="React Icon">
 <img height="32" src="./public/icons/js-svgrepo-com.png" alt="JS Icon">
 <img height="32" src="./public/icons/jquery-svgrepo-com.png" alt="JQUERY Icon">

<br>
<br>

![Svelte Range Slider; focussed with pips and labels prop set](public/svelte-range-slider-screenshot.png)

| 📔🔍 |        Docs | [Full Documentation & Examples](https://simeydotme.github.io/svelte-range-slider-pips/)     |
| :--: | ----------: | :------------------------------------------------------------------------------------------ |
| 📝⚙ |    **REPL** | **[Svelte component demo](https://svelte.dev/playground/e29b748dade74d33a238eefab9a5ce72)** |
| ❤✒ | **Codepen** | **[Plain JS component demo](https://codepen.io/simeydotme/pen/KKNJdbK)**                    |

</div>

## Features

![Features of the range slider plugin (written below)](public/svelte-range-slider-features.png)

- ✨ fully customisable
- ♿ accessible
- 👍🏽 multi-thumb
- 🎚 ranges
- 🏷 floating labels
- 📏 ruler values (pips)
- 🏷 labels for values
- 🧮 step function
- 🖍 formatter
- 🎭 animated
- 🖋 css variables

## Install

Open your project and use the command line to install the package;

```bash
yarn add svelte-range-slider-pips --dev          # or
npm install svelte-range-slider-pips --save-dev  # if you prefer npm
```

## Usage

### In a svelte 4/5 project

Assuming you have a Svelte app up and running;

```svelte
<script>
  import RangeSlider from 'svelte-range-slider-pips';
</script>

<RangeSlider values={[50]} pips />
```

<ul>
  <li>
    <img height="16" src="./public/icons/svelte-svgrepo-com.png" alt="Svelte Icon"> <em>see <a href="./tests/">test folder</a> for examples of <a href="./tests/svelte4/src/App.svelte">usage with Svelte 4</a></em>
    </li>
    <li>
    <img height="16" src="./public/icons/svelte-svgrepo-com.png" alt="Svelte Icon"> <em>or <a href="./tests/svelte5/src/routes/+page.svelte">Svelte 5</em></a>
  </li>
</ul>

---

### In a svelte 3 project

⚠ _Version 3 of Range Slider Pips is not compatible with Svelte 3. [see below](#svelte-3)_

### As a regular JS file

If you're not building a svelte-app, you can use the [`/dist/`
version of the script `/dist/svelte-range-slider-pips.js`](dist/svelte-range-slider-pips.js) and include it
with a regular `<script>` tag.  
This should even work with jQuery.

```html
<!-- in the <head> of your html -->
<script src="./js/vendor/svelte-range-slider-pips.js" />

<!-- in the <body> of your html -->
<div id="my-slider"></div>

<script>
  // this script will be run when the DOM is ready
  // and the slider is initialised
  document.addEventListener('DOMContentLoaded', () => {
    var mySlider = new RangeSliderPips({
      target: document.querySelector('#my-slider'),
      props: { values: [50], pips: true }
    });
  });
</script>
```

<ul>
  <li><img height="16" src="./public/icons/js-svgrepo-com.png" alt="JS Icon"> <em>see examples of <a href="./tests/vanilla/">usage with Vanilla JS </a></em>
  </li>
  <li><img height="16" src="./public/icons/jquery-svgrepo-com.png" alt="jQuery Icon"> <em>or <a href="./tests/jquery/index.jquery.js">running with jQuery </a></em>
  </li>
</ul>

---

### As a JS module, or with Vue & React

If you're building a bleeding-edge JS application (maybe Vue or React), you might
want to use js imports (`import`)

```js
import RangeSlider from './node_modules/svelte-range-slider-pips/dist/svelte-range-slider-pips.mjs';

var mySlider = new RangeSlider({
  target: node, // js reference to a DOM element
  props: { values: [50], pips: true }
});
```

<ul>
  <li><img height="16" src="./public/icons/js-svgrepo-com.png" alt="JS Icon"> <em>see examples of <a href="./tests/vanilla/esm.html">usage with ES modules </a></em>
  </li>
  <li><img height="16" src="./public/icons/vuejs-svgrepo-com.png" alt="Vue Icon"> <em>or <a href="./tests/vuejs/src/App.vue">usage with VueJS </a></em>
  </li>
  <li><img height="16" src="./public/icons/react-svgrepo-com.png" alt="React Icon"> <em>or <a href="./tests/reactjs/src/App.js">importing with ReactJS </a></em>
  </li>
</ul>

---

<br>

## Props (options)

### Slider props

| prop                | type               | default                             | description                                                                                                                                                                                |
| ------------------- | ------------------ | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **value**           | `Number`           | `50`                                | Value to apply on the slider.                                                                                                                                                              |
| **values**          | `Array`            | `[50]`                              | Array of values to apply on the slider. Multiple values creates multiple handles. (_**note:** A slider with `range` property set can only have two values max_)                            |
| **min**             | `Number`           | `0`                                 | Minimum value for the slider _(should be `< max`)_                                                                                                                                         |
| **max**             | `Number`           | `100`                               | Maximum value for the slider _(should be `> min`)_                                                                                                                                         |
| **step**            | `Number`           | `1`                                 | Every `nth` value to allow handle to stop at _(should be a positive value)_                                                                                                                |
| **range**           | `Boolean`/`String` | `false`                             | Whether to style as a range picker. Use `range='min'` or `range='max'` for min/max variants                                                                                                |
| **pushy**           | `Boolean`          | `false`                             | If `range` is `true`, then this boolean decides if one handle will push the other along                                                                                                    |
| **float**           | `Boolean`          | `false`                             | Set true to add a floating label above focussed handles                                                                                                                                    |
| **vertical**        | `Boolean`          | `false`                             | Make the slider render vertically (lower value on bottom)                                                                                                                                  |
| **pips**            | `Boolean`          | `false`                             | Whether to show pips/notches on the slider                                                                                                                                                 |
| **pipstep**         | `Number`           | `1`/`10`/`20`                       | Every `nth` step to show a pip for. This has multiple defaults depending on `values` property                                                                                              |
| **first**           | `Boolean`/`String` | `false`                             | Whether to show a pip or label for the first value on slider. Use `first='label'` to show a label value                                                                                    |
| **last**            | `Boolean`/`String` | `false`                             | Whether to show a pip or label for the last value on slider. Use `last='label'` to show a label value                                                                                      |
| **rest**            | `Boolean`/`String` | `false`                             | Whether to show a pip or label for all other values. Use `rest='label'` to show a label value                                                                                              |
| **all**             | `Boolean`/`String` | `false`                             | Whether to show a pip or label for all values. Same as combining `first`, `last` and `rest`. Use `all='label'` to show a label value                                                       |
| **prefix**          | `String`           | `""`                                | A string to prefix to all displayed values                                                                                                                                                 |
| **suffix**          | `String`           | `""`                                | A string to suffix to all displayed values                                                                                                                                                 |
| **limits**          | `Array`            | `[0, 100]`                          | An array of two numbers to set a limit on the handles. This overrides `min` and `max` if set, while still using them for the range display.                                                |
| **reversed**        | `Boolean`          | `false`                             | Reverse the orientation of min/max                                                                                                                                                         |
| **hoverable**       | `Boolean`          | `true`                              | Whether hover styles are enabled for both handles and pips/values                                                                                                                          |
| **disabled**        | `Boolean`          | `false`                             | Determine if the slider is disabled, or enabled _(only disables interactions, and events)_                                                                                                 |
| **id**              | `String`           | `""`                                | Give the slider a unique ID for use in styling                                                                                                                                             |
| **ariaLabels**      | `Array`            | `[]`                                | Array of strings to use for the `aria-label` attribute on the handles.                                                                                                                     |
| **formatter**       | `Function`         | `(v,i,p) => v`                      | A function to re-format values before they are displayed (`v = value, i = pip index, p = percent`)                                                                                         |
| **handleFormatter** | `Function`         | `formatter`                         | A function to re-format values on the handle/float before they are displayed. Defaults to the same function given to the `formatter` property (`v = value, i = handle index, p = percent`) |
| **springValues**    | `Object`           | `{ stiffness: 0.15, damping: 0.4 }` | Svelte spring physics object to change the behaviour of the handle when moving                                                                                                             |
| **slider**          | `Element`          | `undefined`                         | DOM reference for binding to the main `<div />` of the component (`bind:slider='ref'`)                                                                                                     |

**[📔🔍 | Documentation for Options](https://simeydotme.github.io/svelte-range-slider-pips/en/options/)**
<br>
<br>

### Slider events (dispatched)

| event      | example                      | `event.detail`                                                                                    | description                                                                                |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **start**  | `on:start={(e) => { ... }}`  | `{ activeHandle: Integer, value: Float, values: Array }`                                          | Event fired when the user begins interaction with the slider                               |
| **change** | `on:change={(e) => { ... }}` | `{ activeHandle: Integer, startValue: Float, previousValue: Float, value: Float, values: Array }` | Event fired when the user changes the value; returns the previous value, also              |
| **stop**   | `on:stop={(e) => { ... }}`   | `{ activeHandle: Integer, startValue: Float, value: Float, values: Array }`                       | Event fired when the user stops interacting with slider; returns the beginning value, also |

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

<br>
<br>

---

## Notes

### Svelte 3

Because of the code in Range Slider Pips 3, it is now incompatible with Svelte version 3.

If you are unable to upgrade your project, then I suggest looking for [Svelte-Range-Slider-Pips version `2.3.1`](https://github.com/simeydotme/svelte-range-slider-pips/tree/2.3.1) which
will not be upgraded, but it's still pretty robust. You can install it like so;

```bash
yarn add svelte-range-slider-pips@2.3.1 --dev          # or
npm install svelte-range-slider-pips@2.3.1 --save-dev  # if you prefer npm
```

<br>
<br>
<br>

---

## Support / Tip

I'd be super excited if you find this project useful and wish to donate a small amount for my efforts!

| <img src="https://user-images.githubusercontent.com/2817396/149629283-6002944f-9253-4e35-917d-89b476deae4e.png" width=30> |   [![£1 One Pound Tip](https://user-images.githubusercontent.com/2817396/149629980-08b9a952-bd6a-4c23-be78-05e3fd534352.png)](https://www.paypal.com/paypalme/simey/1) | [£1 GBP Tip](https://www.paypal.com/paypalme/simey/1)   |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------: | ------------------------------------------------------- |
| <img src="https://user-images.githubusercontent.com/2817396/149629283-6002944f-9253-4e35-917d-89b476deae4e.png" width=30> |  [![£5 Five Pound Tip](https://user-images.githubusercontent.com/2817396/149629994-3a99770c-d333-46e7-9818-ab6b18ad0202.png)](https://www.paypal.com/paypalme/simey/5) | [£5 GBP Tip](https://www.paypal.com/paypalme/simey/5)   |
| <img src="https://user-images.githubusercontent.com/2817396/149629283-6002944f-9253-4e35-917d-89b476deae4e.png" width=30> | [![£10 Ten Pound Tip](https://user-images.githubusercontent.com/2817396/149630000-95aa4234-ff67-4e7c-a7f4-ffd52f25e6d8.png)](https://www.paypal.com/paypalme/simey/10) | [£10 GBP Tip](https://www.paypal.com/paypalme/simey/10) |
