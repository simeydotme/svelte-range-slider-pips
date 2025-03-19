# Upgrading from v3 to v4

This guide documents the changes required when upgrading from Svelte Range Slider Pips v3 to v4.

## CSS Class Name Changes

In v4, CSS class names have been prefixed with `rs` to prevent conflicts with generic CSS frameworks like DaisyUI or UnoCSS. This change affects state and modifier classes used in the component.

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