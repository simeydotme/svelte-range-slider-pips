<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
  import type { Formatter } from '../../../../../lib/types.js';

  // Basic values
  let value = 50;
  let values = [25, 75];
  let multiValues = [10, 30, 50, 70, 90];

  // Edge case values
  let largeValues = [1000000, 2000000];
  let negativeValues = [-50, -20];
  let decimalValues = [10.25, 20.75];
  let sameValues = [50, 50];
  let zeroValues = [0, 0];
  let extremeValues = [-999999.99, 999999.99];

  // Dynamic state
  let currentFormatter = 0;
  let customValue = 42;
  let formatterEnabled = true;
  let currentPrefix = '';
  let currentSuffix = '';

  // Basic formatters
  const defaultFormatter: Formatter = (v: number) => String(v);
  const numberFormatter: Formatter = (v: number) => v.toFixed(2);
  const currencyFormatter: Formatter = (v: number) => `$${v.toFixed(2)}`;
  const percentFormatter: Formatter = (v: number, index?: number, percent?: number) =>
    `${percent?.toFixed(1) ?? '0.0'}%`;
  const indexFormatter: Formatter = (v: number, index?: number) => `Handle ${(index ?? 0) + 1}: ${v}`;
  const htmlFormatter: Formatter = (v: number) => `<strong>${v}</strong>`;
  const heavyFormatter: Formatter = (v: number) => {
    // Simulate heavy processing
    let result = v;
    for (let i = 0; i < 1000; i++) {
      result = Math.sqrt(v * i);
    }
    return result.toFixed(2);
  };

  // Formatter that uses locale
  const localeFormatter: Formatter = (v: number) => v.toLocaleString('de-DE');

  // Array of formatters for dynamic testing
  const formatters = [
    { name: 'Default', fn: defaultFormatter },
    { name: 'Number', fn: numberFormatter },
    { name: 'Currency', fn: currencyFormatter },
    { name: 'Percent', fn: percentFormatter },
    { name: 'Index', fn: indexFormatter },
    { name: 'HTML', fn: htmlFormatter }
  ];

  function cycleFormatter() {
    currentFormatter = (currentFormatter + 1) % formatters.length;
    document.querySelector('#dynamic-formatter .rangeHandle')?.dispatchEvent(new Event('focus'));
  }

  function togglePrefix() {
    currentPrefix = currentPrefix ? '' : 'Value: ';
    document.querySelector('#dynamic-formatter .rangeHandle')?.dispatchEvent(new Event('focus'));
  }

  function toggleSuffix() {
    currentSuffix = currentSuffix ? '' : ' units';
    document.querySelector('#dynamic-formatter .rangeHandle')?.dispatchEvent(new Event('focus'));
  }

  function toggleFormatter() {
    formatterEnabled = !formatterEnabled;
    document.querySelector('#formatter-toggle .rangeHandle')?.dispatchEvent(new Event('focus'));
  }
</script>

<div class="slider-list">
  <h5>Basic Formatter Tests</h5>
  <h6>Default formatter - no formatting applied</h6>
  <RangeSlider id="default-formatter" {value} float />
  <h6>Number formatter - displays values with 2 decimal places</h6>
  <RangeSlider id="number-formatter" {value} handleFormatter={numberFormatter} float />
  <h6>Currency formatter - displays values with $ prefix and 2 decimal places</h6>
  <RangeSlider id="currency-formatter" {value} handleFormatter={currencyFormatter} float />
  <h6>Percent formatter - displays values as percentages with 1 decimal place</h6>
  <RangeSlider id="percent-formatter" {value} handleFormatter={percentFormatter} float />
  <h6>Index formatter - displays handle number and value</h6>
  <RangeSlider id="index-formatter" values={multiValues} handleFormatter={indexFormatter} float />
  <h6>HTML formatter - displays values with HTML formatting</h6>
  <RangeSlider id="html-formatter" {value} handleFormatter={htmlFormatter} float />

  <h5>Edge Cases</h5>
  <h6>Large numbers - handles values in millions</h6>
  <RangeSlider
    id="large-numbers"
    values={[250000, 2000000]}
    handleFormatter={(v) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(v)}
    min={0}
    max={5000000}
    float
  />
  <h6>Negative numbers - handles negative values</h6>
  <RangeSlider
    id="negative-numbers"
    values={negativeValues}
    handleFormatter={numberFormatter}
    min={-100}
    max={0}
    float
  />
  <h6>Decimal numbers - handles values with decimal places</h6>
  <RangeSlider id="decimal-numbers" values={decimalValues} handleFormatter={numberFormatter} step={0.25} float />
  <h6>Same values - handles when both handles have identical values</h6>
  <RangeSlider id="same-values" values={sameValues} handleFormatter={numberFormatter} float />
  <h6>Zero values - handles when both handles are at zero</h6>
  <RangeSlider id="zero-values" values={zeroValues} handleFormatter={numberFormatter} float />
  <h6>Extreme values - handles very large positive and negative values</h6>
  <RangeSlider
    id="extreme-values"
    values={extremeValues}
    handleFormatter={numberFormatter}
    min={-1000000}
    max={1000000}
    float
  />
  <h6>Undefined formatter - handles when formatter is undefined</h6>
  <RangeSlider id="undefined-formatter" {value} handleFormatter={undefined} formatter={() => 'x'} float />

  <h5>Accessibility Tests</h5>
  <h6>Basic formatter with aria labels - tests screen reader compatibility</h6>
  <RangeSlider
    id="aria-basic"
    {values}
    handleFormatter={numberFormatter}
    ariaLabels={['First handle', 'Second handle']}
    float
  />
  <h6>HTML formatter with aria labels - tests HTML content in screen readers</h6>
  <RangeSlider
    id="aria-html"
    {values}
    handleFormatter={htmlFormatter}
    ariaLabels={['First handle', 'Second handle']}
    float
  />
  <h6>Locale formatter with aria labels - tests localized number formatting</h6>
  <RangeSlider
    id="aria-locale"
    {values}
    handleFormatter={localeFormatter}
    ariaLabels={['First handle', 'Second handle']}
    float
  />

  <h5>Dynamic Formatter Tests</h5>
  <div class="dynamic-container">
    <h6>Dynamic formatter - tests runtime formatter changes and prefix/suffix toggling</h6>
    <RangeSlider
      id="dynamic-formatter"
      bind:value={customValue}
      handleFormatter={formatterEnabled ? formatters[currentFormatter].fn : (v) => v}
      prefix={currentPrefix}
      suffix={currentSuffix}
      float
    />
    <p>Current formatter: {formatters[currentFormatter].name}</p>
    <div class="controls">
      <button id="btn_change" on:click={cycleFormatter}>Change Formatter</button>

      <button id="btn_prefix" on:click={togglePrefix}>
        {currentPrefix ? 'Remove' : 'Add'} Prefix
      </button>
      <button id="btn_suffix" on:click={toggleSuffix}>
        {currentSuffix ? 'Remove' : 'Add'} Suffix
      </button>
      <input type="number" bind:value={customValue} />
    </div>
  </div>

  <h6>Formatter toggle - tests enabling and disabling formatters with specific formatting</h6>
  <RangeSlider id="formatter-toggle" value={42} handleFormatter={formatterEnabled ? numberFormatter : (v) => v} float />
  <div class="controls">
    <button id="btn_toggle" on:click={toggleFormatter}>
      {formatterEnabled ? 'Disable' : 'Enable'} Formatter
    </button>
  </div>

  <h5>Formatter Context Tests</h5>
  <h6>Reversed mode - tests percentage calculation in reversed orientation</h6>
  <RangeSlider id="reversed-mode" {value} reversed handleFormatter={percentFormatter} float />
  <h6>Vertical mode - tests formatting in vertical orientation</h6>
  <RangeSlider id="vertical-mode" {value} vertical handleFormatter={percentFormatter} float />
  <h6>Custom range - tests formatting with non-standard min/max values</h6>
  <RangeSlider id="custom-range" {value} min={-100} max={200} handleFormatter={percentFormatter} float />
  <h6>Step values - tests formatting with non-unit step values</h6>
  <RangeSlider id="step-values" value={67} step={5} handleFormatter={percentFormatter} float />

  <h5>Performance Tests</h5>
  <h6>Many handles - tests formatting with multiple handles</h6>
  <RangeSlider id="many-handles" values={multiValues} handleFormatter={numberFormatter} prefix="💴" float />
  <h6>Heavy formatter - tests performance with computationally expensive formatter</h6>
  <RangeSlider id="heavy-formatter" {value} handleFormatter={heavyFormatter} float />

  <h5>Formatter Inheritance Tests</h5>
  <h6>Formatter inheritance - tests handleFormatter inheriting from formatter</h6>
  <RangeSlider id="formatter-inheritance" range values={[40, 60]} formatter={indexFormatter} float />

  <h5>Invalid Formatter Tests</h5>
  <h6>Null handle formatter - tests fallback to default formatter when handleFormatter is null</h6>
  <RangeSlider id="null-handle-formatter" {value} handleFormatter={null} float />
  <h6>Undefined handle formatter - tests fallback to default formatter when handleFormatter is undefined</h6>
  <RangeSlider id="undefined-handle-formatter" {value} formatter={indexFormatter} handleFormatter={undefined} float />
</div>

<style>
  .slider-list {
    padding: 1em;
  }
  .controls {
    margin-top: 1em;
    display: flex;
    gap: 1em;
    align-items: center;
  }
</style>
