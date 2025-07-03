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
  <h2>Basic Formatter Tests</h2>
  <h3>Default formatter - no formatting applied</h3>
  <RangeSlider id="default-formatter" {value} float />
  <h3>Number formatter - displays values with 2 decimal places</h3>
  <RangeSlider id="number-formatter" {value} handleFormatter={numberFormatter} float />
  <h3>Currency formatter - displays values with $ prefix and 2 decimal places</h3>
  <RangeSlider id="currency-formatter" {value} handleFormatter={currencyFormatter} float />
  <h3>Percent formatter - displays values as percentages with 1 decimal place</h3>
  <RangeSlider id="percent-formatter" {value} handleFormatter={percentFormatter} float />
  <h3>Index formatter - displays handle number and value</h3>
  <RangeSlider id="index-formatter" values={multiValues} handleFormatter={indexFormatter} float />
  <h3>HTML formatter - displays values with HTML formatting</h3>
  <RangeSlider id="html-formatter" {value} handleFormatter={htmlFormatter} float />

  <h2>Edge Cases</h2>
  <h3>Large numbers - handles values in millions</h3>
  <RangeSlider
    id="large-numbers"
    values={[250000, 2000000]}
    handleFormatter={(v) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(v)}
    min={0}
    max={5000000}
    float
  />
  <h3>Negative numbers - handles negative values</h3>
  <RangeSlider
    id="negative-numbers"
    values={negativeValues}
    handleFormatter={numberFormatter}
    min={-100}
    max={0}
    float
  />
  <h3>Decimal numbers - handles values with decimal places</h3>
  <RangeSlider id="decimal-numbers" values={decimalValues} handleFormatter={numberFormatter} step={0.25} float />
  <h3>Same values - handles when both handles have identical values</h3>
  <RangeSlider id="same-values" values={sameValues} handleFormatter={numberFormatter} float />
  <h3>Zero values - handles when both handles are at zero</h3>
  <RangeSlider id="zero-values" values={zeroValues} handleFormatter={numberFormatter} float />
  <h3>Extreme values - handles very large positive and negative values</h3>
  <RangeSlider
    id="extreme-values"
    values={extremeValues}
    handleFormatter={numberFormatter}
    min={-1000000}
    max={1000000}
    float
  />
  <h3>Undefined formatter - handles when formatter is undefined</h3>
  <RangeSlider id="undefined-formatter" {value} handleFormatter={undefined} formatter={() => 'x'} float />

  <h2>Accessibility Tests</h2>
  <h3>Basic formatter with aria labels - tests screen reader compatibility</h3>
  <RangeSlider
    id="aria-basic"
    {values}
    handleFormatter={numberFormatter}
    ariaLabels={['First handle', 'Second handle']}
    float
  />
  <h3>HTML formatter with aria labels - tests HTML content in screen readers</h3>
  <RangeSlider
    id="aria-html"
    {values}
    handleFormatter={htmlFormatter}
    ariaLabels={['First handle', 'Second handle']}
    float
  />
  <h3>Locale formatter with aria labels - tests localized number formatting</h3>
  <RangeSlider
    id="aria-locale"
    {values}
    handleFormatter={localeFormatter}
    ariaLabels={['First handle', 'Second handle']}
    float
  />

  <h2>Dynamic Formatter Tests</h2>
  <div class="dynamic-container">
    <h3>Dynamic formatter - tests runtime formatter changes and prefix/suffix toggling</h3>
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
      <button id="btn_change" class="btn btn-neutral" on:click={cycleFormatter}>Change Formatter</button>
      <button id="btn_prefix" class:btn-primary={currentPrefix} on:click={togglePrefix}>
        {currentPrefix ? 'Remove' : 'Add'} Prefix
      </button>
      <button id="btn_suffix" class:btn-primary={currentSuffix} on:click={toggleSuffix}>
        {currentSuffix ? 'Remove' : 'Add'} Suffix
      </button>
      <input type="number" bind:value={customValue} />
    </div>
  </div>

  <h3>Formatter toggle - tests enabling and disabling formatters with specific formatting</h3>
  <RangeSlider id="formatter-toggle" value={42} handleFormatter={formatterEnabled ? numberFormatter : (v) => v} float />
  <div class="controls">
    <button id="btn_toggle" on:click={toggleFormatter}>
      {formatterEnabled ? 'Disable' : 'Enable'} Formatter
    </button>
  </div>

  <h2>Formatter Context Tests</h2>
  <h3>Reversed mode - tests percentage calculation in reversed orientation</h3>
  <RangeSlider id="reversed-mode" value={75} reversed handleFormatter={percentFormatter} float />
  <h3>Vertical mode - tests formatting in vertical orientation</h3>
  <RangeSlider id="vertical-mode" value={75} vertical handleFormatter={percentFormatter} float />
  <h3>Custom range - tests formatting with non-standard min/max values</h3>
  <RangeSlider id="custom-range" {value} min={-100} max={200} handleFormatter={percentFormatter} float />
  <h3>Step values - tests formatting with non-unit step values</h3>
  <RangeSlider id="step-values" value={67} step={5} handleFormatter={percentFormatter} float />

  <h2>Performance Tests</h2>
  <h3>Many handles - tests formatting with multiple handles</h3>
  <RangeSlider id="many-handles" values={multiValues} handleFormatter={numberFormatter} prefix="💴" float />
  <h3>Heavy formatter - tests performance with computationally expensive formatter</h3>
  <RangeSlider id="heavy-formatter" {value} handleFormatter={heavyFormatter} float />

  <h2>Formatter Inheritance Tests</h2>
  <h3>Formatter inheritance - tests handleFormatter inheriting from formatter</h3>
  <RangeSlider id="formatter-inheritance" range values={[40, 60]} formatter={indexFormatter} float />

  <h2>Invalid Formatter Tests</h2>
  <h3>Null handle formatter - tests fallback to default formatter when handleFormatter is null</h3>
  <RangeSlider id="null-handle-formatter" {value} handleFormatter={null} float />
  <h3>Undefined handle formatter - tests fallback to default formatter when handleFormatter is undefined</h3>
  <RangeSlider id="undefined-handle-formatter" {value} formatter={indexFormatter} handleFormatter={undefined} float />
</div>
