
# Svelte Range Slider (with pips)
## [`svelte-range-slider-pips`](https://www.npmjs.com/package/svelte-range-slider-pips) @ **npm**

A reactive, accessible, multi-thumb, range slider for use in a svelte application; with the ability to display "pips" or "notches" along the range.

![Image of the Svelte Range Slider, set as focussed, including some pips](test/public/slider.png)

**[🔗 _For full documentation and examples, see the Github Pages_](https://simeydotme.github.io/svelte-range-slider-pips/)**


---

## features

- ✨ fully customisable
- ✨ fully stylable
- ✨ fully accessible (with aria)
- 👍🏽 multi-thumb
- 🎚 range (min/max)
- 🏷 floating labels
- 📏 ruler notches
- 🏷 labels for notches
- 🧮 step function
- 🖍 formatter
- 🎭 animated

## install

Open your project and use the command line to install the package;
```bash
yarn add --dev svelte-range-slider-pips         # or
npm install --save-dev svelte-range-slider-pips # if you prefer npm
```

## usage

### in a svelte project

Assuming you have a Svelte app up and running;

```html
<script>
  import RangeSlider from "svelte-range-slider-pips";
</script>

<RangeSlider />
```

### as a regular JS file

If you're using a different framework, or none, you can use the [`/dist/`
version of the script `/dist/svelte-range-slider-pips.js`](dist/svelte-range-slider-pips.js) and include it
either with a regular `<script>` tag, or by using js imports (`import`)

```html
<script src="./js/vendor/svelte-range-slider-pips.js" />

<div id="my-slider"></div>

<script>
  var mySlider = new RangeSliderPips({
    target: document.getElementById("my-slider"),
    props: { /* props as js object */ }
  });
</script>
```

### as a JS module
```js
import RangeSlider from "./node_modules/svelte-range-slider-pips/dist/svelte-range-slider-pips.mjs";

var mySlider = new RangeSlider({
  target: node, // js reference to a DOM element
  props: { /* props as js object */ }
});
```

---

## props (options)
### slider props
prop | type | default | description
-----|------|---------|-------------
**values** | `Array` | `[50]` | Array of values to apply on the slider. Multiple values creates multiple handles. (_**note:** A slider with `range` property set can only have two values max_)
**min** | `Number` | `0` | Minimum value for the slider
**max** | `Number` | `100` | Maximum value for the slider
**step** | `Number` | `1` | Every `nth` value to allow handle to stop at
**range** | `Boolean`/`String` | `false` | Whether to style as a range picker. Use `range='min'` or `range='max'` for min/max variants
**pushy** | `Boolean` | `false` | If `range` is `true`, then this boolean decides if one handle will push the other along
**float** | `Boolean` | `false` | Set true to add a floating label above focussed handles
**vertical** | `Boolean` | `false` | Make the slider render vertically
**pips** | `Boolean` | `false` | Whether to show pips/notches on the slider
**pipStep** | `Number` | `1`/`10`/`20` | Every `nth` step to show a pip for. This has multiple defaults depending on `values` property
**first** | `Boolean`/`String` | `false` | Whether to show a pip or label for the first value on slider. Use `first='label'` to show a label value
**last** | `Boolean`/`String` | `false` | Whether to show a pip or label for the last value on slider. Use `last='label'` to show a label value
**rest** | `Boolean`/`String` | `false` | Whether to show a pip or label for the all other values. Use `rest='label'` to show a label value
**prefix** | `String` | `""` | A string to prefix to all displayed values
**suffix** | `String` | `""` | A string to suffix to all displayed values
**formatter** | `Function` | `(v) => v` | A function to re-format values before they are displayed
**handleFormatter** | `Function` | `formatter` | A function to re-format values on the handle/float before they are displayed. Defaults to the same function given to the `formatter` property
**springValues** | `Object` | `{ stiffness: 0.15, damping: 0.4 }` | Svelte spring physics object to change the behaviour of the handle when moving

**[🔗 _For full documentation and examples, see the Github Pages_](https://simeydotme.github.io/svelte-range-slider-pips/)**


## contribute

I am very happy to accept;
- 🌟 suggestions/requests for new features or changes
- 🛠 pull-requests for bug fixes, or issue resolution
- 🧪 help with creating a proper test-suite

[Read the CONTRIBUTING.md](./CONTRIBUTING.md)

