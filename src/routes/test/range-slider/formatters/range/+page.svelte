<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
  import type { Formatter, RangeFormatter } from '../../../../../lib/types.js';

  // Basic values
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
  let customValues = [3000, 7000];
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
  const localeFormatter: Formatter = (v: number) => v.toLocaleString('de-DE');

  // Range formatters
  const defaultRangeFormatter: RangeFormatter = (v1: number, v2: number) => `${v1} - ${v2}`;
  const numberRangeFormatter: RangeFormatter = (v1: number, v2: number) => `${v1.toFixed(2)} - ${v2.toFixed(2)}`;
  const currencyRangeFormatter: RangeFormatter = (v1: number, v2: number) => `$${v1.toFixed(2)} - $${v2.toFixed(2)}`;
  const percentRangeFormatter: RangeFormatter = (v1: number, v2: number, p1?: number, p2?: number) =>
    `${p1?.toFixed(1) ?? '0.0'}% - ${p2?.toFixed(1) ?? '0.0'}%`;
  const htmlRangeFormatter: RangeFormatter = (v1: number, v2: number) => `<strong>${v1}</strong> to <em>${v2}</em>`;
  const localeRangeFormatter: RangeFormatter = (v1: number, v2: number) =>
    `${v1.toLocaleString('de-DE')} - ${v2.toLocaleString('de-DE')}`;
  const heavyRangeFormatter: RangeFormatter = (v1: number, v2: number) => {
    // Simulate heavy processing
    let result1 = v1;
    let result2 = v2;
    for (let i = 0; i < 1000; i++) {
      result1 = Math.sqrt(v1 * i);
      result2 = Math.sqrt(v2 * i);
    }
    return `${result1.toFixed(2)} - ${result2.toFixed(2)}`;
  };

  // Array of formatters for dynamic testing
  const formatters = [
    { name: 'Default', fn: defaultFormatter, rangeFn: defaultRangeFormatter },
    { name: 'Number', fn: numberFormatter, rangeFn: numberRangeFormatter },
    { name: 'Currency', fn: currencyFormatter, rangeFn: currencyRangeFormatter },
    { name: 'Percent', fn: percentFormatter, rangeFn: percentRangeFormatter },
    { name: 'HTML', fn: htmlFormatter, rangeFn: htmlRangeFormatter },
    { name: 'Locale', fn: localeFormatter, rangeFn: localeRangeFormatter }
  ];

  function cycleFormatter() {
    currentFormatter = (currentFormatter + 1) % formatters.length;
    document.querySelector('#dynamic-formatter .rangeHandle')?.dispatchEvent(new Event('focus'));
  }

  function toggleFormatter() {
    formatterEnabled = !formatterEnabled;
    document.querySelector('#dynamic-formatter .rangeHandle')?.dispatchEvent(new Event('focus'));
  }

  function togglePrefix() {
    currentPrefix = currentPrefix ? '' : 'Range: ';
    document.querySelector('#prefix-suffix-test .rangeHandle')?.dispatchEvent(new Event('focus'));
  }

  function toggleSuffix() {
    currentSuffix = currentSuffix ? '' : ' units';
    document.querySelector('#prefix-suffix-test .rangeHandle')?.dispatchEvent(new Event('focus'));
  }
</script>

<div class="slider-list">
  <h5>Basic Range Formatter Tests</h5>
  <h6>Default range formatter - no formatting applied</h6>
  <RangeSlider id="default-range-formatter" range {values} rangeFloat />
  <h6>Number range formatter - displays values with 2 decimal places</h6>
  <RangeSlider
    id="number-range-formatter"
    range
    {values}
    handleFormatter={numberFormatter}
    rangeFormatter={numberRangeFormatter}
    rangeFloat
  />
  <h6>Currency range formatter - displays values with $ prefix and 2 decimal places</h6>
  <RangeSlider
    id="currency-range-formatter"
    range
    {values}
    handleFormatter={currencyFormatter}
    rangeFormatter={currencyRangeFormatter}
    rangeFloat
  />
  <h6>Percent range formatter - displays values as percentages with 1 decimal place</h6>
  <RangeSlider
    id="percent-range-formatter"
    range
    {values}
    handleFormatter={percentFormatter}
    rangeFormatter={percentRangeFormatter}
    rangeFloat
  />
  <h6>HTML range formatter - displays values with HTML formatting</h6>
  <RangeSlider
    id="html-range-formatter"
    range
    {values}
    handleFormatter={htmlFormatter}
    rangeFormatter={htmlRangeFormatter}
    rangeFloat
  />

  <h5>Edge Cases</h5>
  <h6>Large numbers - handles values in millions</h6>
  <RangeSlider
    id="large-numbers"
    range
    values={largeValues}
    handleFormatter={numberFormatter}
    rangeFormatter={numberRangeFormatter}
    min={0}
    max={5000000}
    rangeFloat
  />
  <h6>Negative numbers - handles negative values</h6>
  <RangeSlider
    id="negative-numbers"
    range
    values={negativeValues}
    handleFormatter={numberFormatter}
    rangeFormatter={numberRangeFormatter}
    min={-100}
    max={0}
    rangeFloat
  />
  <h6>Decimal numbers - handles values with decimal places</h6>
  <RangeSlider
    id="decimal-numbers"
    range
    values={decimalValues}
    handleFormatter={numberFormatter}
    rangeFormatter={defaultRangeFormatter}
    step={0.25}
    rangeFloat
  />
  <h6>Same values - handles when both handles have identical values</h6>
  <RangeSlider
    id="same-values"
    range
    values={sameValues}
    handleFormatter={numberFormatter}
    rangeFormatter={numberRangeFormatter}
    rangeFloat
  />
  <h6>Zero values - handles when both handles are at zero</h6>
  <RangeSlider
    id="zero-values"
    range
    values={zeroValues}
    handleFormatter={numberFormatter}
    rangeFormatter={numberRangeFormatter}
    rangeFloat
  />
  <h6>Extreme values - handles very large positive and negative values</h6>
  <RangeSlider
    id="extreme-values"
    range
    values={extremeValues}
    handleFormatter={numberFormatter}
    rangeFormatter={numberRangeFormatter}
    min={-1000000}
    max={1000000}
    rangeFloat
  />

  <h5>Accessibility Tests</h5>
  <h6>Basic formatter with aria labels - tests screen reader compatibility</h6>
  <RangeSlider
    id="aria-basic"
    range
    {values}
    handleFormatter={numberFormatter}
    rangeFormatter={defaultRangeFormatter}
    ariaLabels={['First handle', 'Second handle']}
    rangeFloat
  />
  <h6>HTML formatter with aria labels - tests HTML content in screen readers</h6>
  <RangeSlider
    id="aria-html"
    range
    {values}
    handleFormatter={htmlFormatter}
    rangeFormatter={htmlRangeFormatter}
    ariaLabels={['First handle', 'Second handle']}
    rangeFloat
  />
  <h6>Locale formatter with aria labels - tests localized number formatting</h6>
  <RangeSlider
    id="aria-locale"
    range
    {values}
    handleFormatter={localeFormatter}
    rangeFormatter={localeRangeFormatter}
    ariaLabels={['First handle', 'Second handle']}
    rangeFloat
  />

  <h5>Dynamic Formatter Tests</h5>
  <div class="dynamic-container">
    <h6>Dynamic formatter - tests runtime formatter changes</h6>
    <RangeSlider
      id="dynamic-formatter"
      range
      max={10000}
      values={customValues}
      handleFormatter={formatterEnabled ? formatters[currentFormatter].fn : undefined}
      rangeFormatter={formatterEnabled ? formatters[currentFormatter].rangeFn : undefined}
      rangeFloat
      draggy
    />
    <p>Current formatter: {formatters[currentFormatter].name}</p>
    <div class="controls">
      <button id="btn_cycle" on:click={cycleFormatter}>Change Formatter</button>
      <button id="btn_toggle" class:btn-primary={formatterEnabled} on:click={toggleFormatter}>
        {formatterEnabled ? 'Disable' : 'Enable'} Formatter
      </button>
      <div class="value-inputs">
        <input type="number" bind:value={customValues[0]} />
        <input type="number" bind:value={customValues[1]} />
      </div>
    </div>
  </div>

  <h5>Prefix and Suffix Tests</h5>
  <div class="prefix-suffix-container">
    <h6>Prefix and suffix - tests independent prefix/suffix toggling</h6>
    <RangeSlider
      id="prefix-suffix-test"
      range
      values={[30, 70]}
      prefix={currentPrefix}
      suffix={currentSuffix}
      rangeFloat
      draggy
    />
    <div class="controls">
      <button id="btn_prefix" class:btn-primary={currentPrefix} on:click={togglePrefix}>
        {currentPrefix ? 'Remove' : 'Add'} Prefix
      </button>
      <button id="btn_suffix" class:btn-primary={currentSuffix} on:click={toggleSuffix}>
        {currentSuffix ? 'Remove' : 'Add'} Suffix
      </button>
    </div>
  </div>

  <h5>Formatter Context Tests</h5>
  <h6>Reversed mode - tests percentage calculation in reversed orientation</h6>
  <RangeSlider
    id="reversed-mode"
    range
    {values}
    reversed
    handleFormatter={percentFormatter}
    rangeFormatter={percentRangeFormatter}
    rangeFloat
  />
  <h6>Vertical mode - tests formatting in vertical orientation</h6>
  <RangeSlider
    id="vertical-mode"
    range
    {values}
    vertical
    handleFormatter={percentFormatter}
    rangeFormatter={percentRangeFormatter}
    rangeFloat
  />
  <h6>Custom range - tests formatting with non-standard min/max values</h6>
  <RangeSlider
    id="custom-range"
    range
    values={[-105, 105]}
    min={-150}
    max={150}
    handleFormatter={percentFormatter}
    rangeFormatter={percentRangeFormatter}
    rangeFloat
  />
  <h6>Step values - tests formatting with non-unit step values</h6>
  <RangeSlider
    id="step-values"
    range
    {values}
    step={5}
    handleFormatter={percentFormatter}
    rangeFormatter={percentRangeFormatter}
    rangeFloat
  />

  <h5>Performance Tests</h5>
  <h6>Many handles - tests formatting with multiple handles</h6>
  <RangeSlider id="many-handles" values={multiValues} handleFormatter={numberFormatter} float />
  <h6>Heavy formatter - tests performance with computationally expensive formatter</h6>
  <RangeSlider
    id="heavy-formatter"
    range
    {values}
    handleFormatter={numberFormatter}
    rangeFormatter={heavyRangeFormatter}
    rangeFloat
  />
</div>

<style>
  .dynamic-container {
    margin: 2em 0;
  }
  .value-inputs {
    display: flex;
    gap: 1em;
  }
</style>
