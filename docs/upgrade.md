# Upgrading from v3 to v4

This guide documents the changes required when upgrading from Svelte Range Slider Pips v3 to v4.

## General Upgrade Steps

### 1. Update Dependencies

First, update the package to version 4:

```bash
npm install svelte-range-slider-pips@4
# or
yarn add svelte-range-slider-pips@4
# or
pnpm add svelte-range-slider-pips@4
```

### 2. Breaking Changes

The following changes require immediate attention:

1. **CSS Class Names**: All component classes are now prefixed with `rs` to prevent conflicts with other frameworks
   - See the [CSS Class Name Changes](#css-class-name-changes) section for detailed mapping
   - Update any custom CSS selectors targeting these classes
   - Update any JavaScript code that queries or manipulates these classes

- If you were never applying custom CSS, you can ignore this change.
- All previous css variable names remain valid.


### 3. New Features to Consider

The following features are optional but recommended for review:

1. **Range Controls**:
   - `rangeGapMin` and `rangeGapMax` for controlling handle distances
   - `rangeFloat` for displaying range values
   - `rangeFormatter` for custom range value formatting

2. **Draggable Ranges**:
   - New `draggy` property for range dragging
   - Enhanced user experience for range adjustments

3. **Animation Control**:
   - New `spring` property to control animations
   - `class` property for custom styling

### 4. Bug Fixes and Improvements

The following improvements are automatically applied:

1. **Keyboard Navigation**:
   - More precise percentage-based movements
   - Fixed PageUp/PageDown behavior
   - Better step alignment

2. **Input Validation**:
   - Improved min/max validation
   - Better aria labels handling
   - Enhanced precision handling

3. **Hover States**:
   - More consistent disabled state behavior
   - Better visual feedback

### 5. Testing Checklist

After upgrading, verify the following:

1. [ ] All custom CSS styles are still applied correctly
2. [ ] Hover and focus states work correctly
3. [ ] The component works correctly with your CSS framework

### 6. Getting Help

If you encounter issues during the upgrade:
- Check the [GitHub issues](https://github.com/simeydotme/svelte-range-slider-pips/issues)
- Review the [documentation](https://github.com/simeydotme/svelte-range-slider-pips#readme)
- Open a new issue if needed

---

## New Range Properties [807a2ae6](https://github.com/simeydotme/svelte-range-slider-pips/commit/807a2ae6136a23b20e0b58bd6350ab30ef8b7788) [feature] [resolves #105](https://github.com/simeydotme/svelte-range-slider-pips/issues/105)

In v4, several new properties have been added to enhance range slider functionality. These properties provide more control over range behavior and display.

### Range Gap Controls 

Two new properties allow you to control the minimum and maximum distance between handles in a range slider:

- `rangeGapMin`: Sets the minimum allowed distance between handles
- `rangeGapMax`: Sets the maximum allowed distance between handles

These properties work in conjunction with the existing `pushy` option:
- When `pushy` is true, moving a handle past the gap limit will push the other handle
- When `pushy` is false, handles will stop at the gap limits

Example usage:
```svelte
<RangeSlider
  range={true}
  rangeGapMin={10}
  rangeGapMax={50}
  pushy={true}
/>
```

### Range Float Display

The new `rangeFloat` property allows you to display the range values between the handles:

- When `true`, shows the range values (e.g., "20 - 80")
- Respects existing `prefix` and `suffix` properties
- Works with both regular and reversed ranges

Example usage:
```svelte
<RangeSlider
  range={true}
  rangeFloat={true}
  prefix="$"
/>
```

### Range Value Formatting

The new `rangeFormatter` property provides custom formatting for the range float display:

- Takes a function with signature: `(value1, value2, percent1, percent2)`
- Allows complete control over how the range is displayed
- Can return HTML strings for rich formatting

Example usage:
```svelte
<RangeSlider
  range={true}
  rangeFloat={true}
  rangeFormatter={(v1, v2) => `${v1} to ${v2}`}
/>
```

### Important Notes

- These properties only affect range sliders (when `range={true}`)
- The gap controls respect the slider's `step` and `precision` settings
- Range float display works independently of handle float display
- All new properties are optional and have sensible defaults

## Draggable Range [a473ef7f](https://github.com/simeydotme/svelte-range-slider-pips/commit/a473ef7fe3adc6d16ee783260035f6e43d031e63) [feature] [resolves #150](https://github.com/simeydotme/svelte-range-slider-pips/issues/150)

In v4, range sliders now support dragging the range area between handles. This provides a more intuitive way to adjust both handles simultaneously, particularly useful for date ranges or time periods where you want to maintain a consistent duration while moving the range.

### New Property

- `draggy`: Enables dragging of the range area between handles
  - Only works on range sliders (when `range={true}`)
  - Defaults to `false`

### Event Payload Changes

When dragging the range area, the event payloads are slightly different from handle movement events:

- `start` event:
  - `activeHandle: number` is set to `-1` (indicating range drag)
  - ~~`value: number[]` is an array of both handle values~~ _(not in the payload for dragging ranges)_
  - `values: number[]` contains the initial positions of both handles

- `stop` event:
  - `activeHandle: number` is set to `-1`
  - `startValue: number[]` is an array of initial handle positions
  - ~~`value: number` is the current position of the active handle~~ _(not in the payload for dragging ranges)_
  - `values: number[]` contains the final positions of both handles

- `change` event:
  - `activeHandle: number` is set to `-1`
  - `startValue: number[]` is an array of initial handle positions
  - `previousValue: number[]` is an array of previous handle positions
  - ~~`value: number` is the current position of the active handle~~ _(not in the payload for dragging ranges)_
  - `values: number[]` contains the current positions of both handles

### Example Usage

```svelte
<RangeSlider
  range={true}
  draggy={true}
  on:start={({ values }) => console.log('Range drag started:', values)}
  on:change={({ values }) => console.log('Range changed:', values)}
  on:stop={({ values }) => console.log('Range drag ended:', values)}
/>
```

### Important Notes

- Range dragging respects all existing constraints (min, max, step, precision)
- The range area provides visual feedback during hover and drag
- Range dragging works with both regular and reversed ranges
- The feature is disabled when the slider is disabled

## Keyboard Navigation Improvements [8d809dd](https://github.com/simeydotme/svelte-range-slider-pips/commit/8d809dda6af551ad5fe763ab1e5477cb687ab071) [bugfix] [resolves #152](https://github.com/simeydotme/svelte-range-slider-pips/issues/152)

In v4, keyboard navigation has been improved to provide more precise and intuitive control over the slider values.

### Percentage-Based Movement

The calculation of percentage-based movements has been refined:

- `Ctrl/Cmd + Arrow`: Moves by 1% of the total range
- `Shift + Arrow` or `PageUp/PageDown`: Moves by 10% of the total range

All percentage-based movements are now properly aligned to the slider's `step` value, ensuring consistent behavior.

### PageUp/PageDown Fix

The behavior of `PageUp` and `PageDown` keys has been corrected:
- `PageUp`: Moves the handle up/right (previously was inverted)
- `PageDown`: Moves the handle down/left (previously was inverted)

### Example Usage

```svelte
<RangeSlider
  min={0}
  max={100}
  step={1}
  // Now Ctrl/Cmd + Arrow moves by 1 unit
  // Shift + Arrow or PageUp/PageDown moves by 10 units
/>
```

### Important Notes

- All movements respect the slider's `step` and `precision` settings
- Percentage-based movements are now more predictable and consistent
- The changes affect both single and range sliders

## Input Validation Improvements [d631a69](https://github.com/simeydotme/svelte-range-slider-pips/commit/d631a69204b03dc32c1b6d542d36822a7dfcc27a) [bugfix]

In v4, input validation has been enhanced to provide better error handling and prevent invalid states.

### Min/Max Validation

The component now validates and corrects invalid min/max values:
- If `min` is greater than or equal to `max`, the values are reset to defaults (0 and 100)
- A console error is logged to inform developers of the issue
- This prevents the slider from entering an invalid state

### Aria Labels Validation

The `ariaLabels` property now has improved validation:
- If `ariaLabels` is not an array when using multiple handles, it's automatically converted to an empty array
- A console warning is logged to inform developers of the issue
- This ensures proper accessibility even if labels are incorrectly provided

### Precision Handling

The `precision` property has been moved to the top of the component for better organization and is now properly respected in all calculations.

### Example Usage

```svelte
<RangeSlider
  min={0}
  max={100}
  precision={2}
  ariaLabels={['Minimum value', 'Maximum value']}
/>
```

### Important Notes

- Invalid min/max values are automatically corrected to prevent slider malfunctions
- The component now provides helpful console messages for debugging
- All validation respects the slider's precision settings
- These changes help prevent runtime errors and improve developer experience

## Hover State Changes [d1c86e7](https://github.com/simeydotme/svelte-range-slider-pips/commit/d1c86e7090577406d104c9b1fbb4bd7b78fcfd69) [bugfix]

In v4, hover state behavior has been improved to be more consistent with disabled states.

### Disabled State Behavior

The hover effects are now properly disabled when the slider is disabled:
- Hover effects only show when both `hoverable` is true AND the slider is not disabled
- This affects both handle and range bar hover states
- The change ensures better visual feedback about the slider's interactive state

### Example Usage

```svelte
<RangeSlider
  hoverable={true}
  disabled={true}  // Hover effects will not show
/>

<RangeSlider
  hoverable={true}
  disabled={false} // Hover effects will show
/>

<RangeSlider
  hoverable={false}
  disabled={false} // Hover effects will not show
/>
```

### Important Notes

- This change affects both single and range sliders
- The behavior is consistent across all interactive elements (handles, range bar)
- No changes are needed if you're already properly handling disabled states

## Spring Animation Control [1d83ae6](https://github.com/simeydotme/svelte-range-slider-pips/commit/1d83ae6d6180efa668a93712e6c8f00b295fa08d) [feature] [resolves #92](https://github.com/simeydotme/svelte-range-slider-pips/issues/92)

In v4, you have more control over the slider's animations and styling through new properties. This feature was added in response to user feedback about animation behavior during continuous sliding.

### Animation Control

The new `spring` property allows you to control handle animations:
- Defaults to `true`
- When set to `false`, disables all animations on the slider handles
- Useful for performance optimization or when instant updates are preferred
- Particularly helpful when users are continuously sliding the handle, as it prevents the "gliding" effect through values

### Custom Class Names

The new `class` property allows you to add custom CSS classes to the slider:
- Similar to the existing `id` prop
- Classes are added to the base slider element
- Useful for custom styling or framework integration

### Example Usage

```svelte
<RangeSlider
  spring={false}  // Disable animations for instant updates
  class="my-custom-slider"  // Add custom class
/>

<RangeSlider
  spring={true}  // Enable animations (default)
  class="custom-theme"  // Add custom class
/>
```

### Important Notes

- The `spring` property affects all handle movements (drag, keyboard, programmatic)
- When `spring` is `false`, handle movements are instant
- Custom classes are added alongside the component's internal classes
- These changes are compatible with both single and range sliders
- This feature was added to address the "gliding" effect during continuous sliding, making the slider feel more responsive and precise

## Float Positioning Changes [dd7847f](https://github.com/simeydotme/svelte-range-slider-pips/commit/dd7847f528cef2de50f75985ac9fab4f76fa6d6a) [b5b54ac](https://github.com/simeydotme/svelte-range-slider-pips/commit/b5b54ac98968724efe1f68fbde503bebe8566305) [improvement]

In v4, the positioning of float elements has been updated to improve performance and fix visual glitches:

### CSS Transforms Update

The component now uses the modern `translate` property instead of `transform: translate()`:

- Changed `transform: translate(-50%, -50%)` to `translate: -50% -50% 0.01px`
- Added hardware acceleration via 3D transforms for better performance
- Improved animation easing with `cubic-bezier` timing

### Float Visual Improvements

- Refined padding and border radius for better appearance
- Added subtle scale animations for a more polished feel
- Fixed positioning issues in vertical mode

### Impact on Custom CSS

If you've written custom CSS targeting the float elements, you may need to update:

1. **Custom positioning**: If overriding the position of floats, use the `translate` property instead of `transform`
2. **Animations**: If customizing float animations, update to match the new properties
3. **Z-index handling**: The component now uses 3D transforms which create a new stacking context

### Example of Updated Custom CSS

```css
/* Before (v3) */
.rangeSlider .rangeHandle.active .rangeFloat {
  transform: translate(-50%, -10px);
}

/* After (v4) */
.rangeSlider .rangeHandle.rsActive .rangeFloat {
  translate: -50% -10px 0.01px;
}
```

### Important Notes

- These changes improve rendering on high-DPI displays
- The visual appearance of floats should be preserved by default
- Only users with custom float positioning CSS need to make updates
- The changes affect both handle floats and range floats

## CSS Positioning Changes [0ef2b0e](https://github.com/simeydotme/svelte-range-slider-pips/commit/0ef2b0e2c599242f4a4282c90b4b4471f4b8f168) [improvement]

We've completely changed how handles and range bars are positioned in v4. This is a significant improvement, but might need your attention if you've written custom CSS.

### What Changed

- Handles and range bar now use CSS `translate` instead of `left`/`right` positioning
- Added GPU acceleration with 3D transforms for smoother animations
- Better pip rendering that won't kill your browser when you have tons of them

### If You've Written Custom CSS

If you've styled the slider positions with custom CSS, you might need to update your code.
The component now uses CSS custom properties internally to control positions. 
The handles use `--handle-pos` and the range uses `--range-start`, `--range-end` and `--range-size`.

### Performance Boost

These changes make a big difference in how smoothly the slider runs:
- Much smoother animations, especially on mobile
- Better performance with lots of pips
- No more janky movements when dragging quickly

You don't need to do anything to get these benefits unless you had custom positioning CSS.

## CSS Class Name Changes [2343440f](https://github.com/simeydotme/svelte-range-slider-pips/commit/2343440fb1fb8d233345e7684fa9d4198fd19774) [breaking-change]

In v4, CSS class names have been prefixed with `rs` to prevent conflicts with generic CSS frameworks like DaisyUI or UnoCSS. This change affects state and modifier classes used in the component.

**Only the class names have changed, the css variables remain the same.**

### State Classes

| v3 Class | v4 Class | Description |
|----------|----------|-------------|
| `disabled` | `rsDisabled` | Applied when slider is disabled |
| `hoverable` | `rsHoverable` | Applied when hover effects are enabled |
| `vertical` | `rsVertical` | Applied when slider is vertical |
| `reversed` | `rsReversed` | Applied when slider values are reversed |
| `focus` | `rsFocus` | Applied when slider has focus |
| `range` | `rsRange` | Applied when slider is in range mode |
| `min` | `rsMin` | Applied when range mode is set to 'min' |
| `max` | `rsMax` | Applied when range mode is set to 'max' |
| `pips` | `rsPips` | Applied when pips are enabled |
| `pip-labels` | `rsPipLabels` | Applied when pip labels are enabled |

### Handle Classes

| v3 Class | v4 Class | Description |
|----------|----------|-------------|
| `active` | `rsActive` | Applied when handle is active |
| `press` | `rsPress` | Applied when handle is being pressed |

### Pip Classes

| v3 Class | v4 Class | Description |
|----------|----------|-------------|
| `pip` | `rsPip` | Base class for pips |
| `pip--first` | `rsPip--first` | Applied to first pip |
| `pip--last` | `rsPip--last` | Applied to last pip |
| `selected` | `rsSelected` | Applied when pip is selected |
| `in-range` | `rsInRange` | Applied when pip is within range |
| `out-of-limit` | `rsOutOfLimit` | Applied when pip is outside limits |
| `pipVal` | `rsPipVal` | Class for pip value display |
| `pipVal-prefix` | `rsPipValPrefix` | Class for pip value prefix |
| `pipVal-suffix` | `rsPipValSuffix` | Class for pip value suffix |

### Bar Classes

| v3 Class | v4 Class | Description |
|----------|----------|-------------|
| `rangeDrag` | `rsDrag` | Applied when bar is being dragged |

### Float Classes

| v3 Class | v4 Class | Description |
|----------|----------|-------------|
| `rangeFloat-prefix` | `rsRangeFloatPrefix` | Class for float value prefix |
| `rangeFloat-suffix` | `rsRangeFloatSuffix` | Class for float value suffix |

## CSS Variables

The CSS variables remain unchanged as they were already prefixed with `--` and are specific to the component.

## Dark Mode and Color System [1047235e](https://github.com/simeydotme/svelte-range-slider-pips/commit/1047235e64e210a395c0c3b4c75144cdfba4ae62) [change]

In v4, the color system has been completely revamped to support dark mode and provide a more flexible theming system.
But overall the colours should remain almost identical to `v3`.

### Dark Mode Support

The slider now supports dark mode in two ways:
1. Using the `.dark` class on the slider element
2. Using the `darkmode` prop

#### How to Enable Dark Mode

- **Default (Light mode):**
  ```svelte
  <RangeSlider darkmode={false} />
  ```
  The slider always uses the light color scheme, regardless of system settings.
  This is the same as v3.

- **Automatic (Match system):**
  ```svelte
  <RangeSlider darkmode="auto" />
  ```
  The slider will use dark colors if the user's system prefers dark mode, and light colors otherwise.  
  This is the best option if your website has a dark mode toggle.

- **Force Dark Mode:**
  ```svelte
  <RangeSlider darkmode="force" />
  ```
  The slider always uses the dark color scheme, regardless of system settings.
  This is the best option if your website is just dark.

### New Color System

The component now uses a comprehensive set of CSS variables for theming:

#### Light Theme Variables
```css
--slider-accent: #4a40d4;
--slider-accent-100: #838de7;
--slider-base: #99a2a2;
--slider-base-100: #b9c2c2;
--slider-bg: #d7dada;
--slider-fg: #3f3e4f;
```

#### Dark Theme Variables
```css
--slider-dark-accent: #6070fc;
--slider-dark-accent-100: #7a7fab;
--slider-dark-base: #82809f;
--slider-dark-base-100: #595868;
--slider-dark-bg: #3f3e4f;
--slider-dark-fg: #d7dada;
```

### Simplified Customization

The new system makes it easier to customize the slider's appearance:

1. **Theme-Based Customization**:
   - Override the base theme variables to change the entire color scheme
   - No need to override individual element colors

2. **Element-Specific Customization**:
   - Still supports overriding individual element colors using the existing CSS variables
   - All previous CSS variable names remain valid

3. **Style Prop Support**:
   - New `style` prop allows you to directly pass CSS declarations / variables
   - Works alongside the existing `class` prop
   - Perfect for dynamic theme changes

#### Example Usage

```svelte
<!-- Custom theme colors can be supplied as a css string -->
<RangeSlider
  darkmode="force"
  style="
    --slider-accent: #0ea5e9;
    --slider-bg: #222;
  "
/>

<!-- Custom theme colors using Tailwind classes -->
<RangeSlider
  darkmode="auto"
  class="
    [--slider-accent:var(--color-sky-500)]
    [--slider-accent-100:var(--color-sky-300)]
    [--slider-base:var(--color-slate-500)]
    [--slider-base-100:var(--color-slate-300)]
    [--slider-bg:var(--color-slate-200)]
  "
/>
```

### Important Notes

- Legacy fallback colors have been removed as all modern browsers support CSS variables
- The component is light-mode by default
- Dark mode can be enabled by setting `darkmode="force"`
- The component will follow the system color scheme if `darkmode="auto"` is set.
- Custom themes can be applied by overriding the base theme variables
- All existing CSS variable overrides remain supported for backward compatibility
- The new system provides better color consistency and easier theme management
- CSS variables are now wrapped in `@layer base` to prevent conflicts with Tailwind CSS

## CSS Improvements [b8bc406](https://github.com/simeydotme/svelte-range-slider-pips/commit/b8bc406b46adb8b7b236fabd45e463ab6ab99626) [change]

### Range Bar Transitions

The range bar now has smoother transitions:
- Added subtle transitions on hover

### CSS Layer Support

The component's CSS variables are @layered:
- Wrapped in `@layer base` to prevent conflicts with Tailwind CSS
- this shouldnt affect existing users

## Migration Steps

1. Update any custom CSS selectors that target the component's state or modifier classes to use the new prefixed names
2. If you're using any JavaScript to query or manipulate the component's elements, update the class names in those queries
3. Review any CSS framework configurations that might have been targeting these classes
4. Test the component thoroughly after the update to ensure all styles are applied correctly

## Example

Before (v3):
```css
.rangeSlider .pip.selected {
  background-color: blue;
}
```

After (v4):
```css
.rangeSlider .rsPip.rsSelected {
  background-color: blue;
}
```