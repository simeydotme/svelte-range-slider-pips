<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  import type { Formatter } from '../../../../../lib/types.js';

  // Basic formatters
  const defaultFormatter: Formatter = (v: number) => String(v);
  const numberFormatter: Formatter = (v: number) => v.toFixed(2);
  const currencyFormatter: Formatter = (v: number) => `$${v.toFixed(2)}`;
  const percentFormatter: Formatter = (v: number, index?: number, percent?: number) =>
    `${percent?.toFixed(1) ?? '0.0'}%`;
  const indexFormatter: Formatter = (v: number, index?: number) => `Pip ${(index ?? 0) + 1}: ${v}`;
  const htmlFormatter: Formatter = (v: number) => `<strong>${v}</strong>`;
  const localeFormatter: Formatter = (v: number) => v.toLocaleString('de-DE');
  const heavyFormatter: Formatter = (v: number) => {
    // Simulate heavy processing
    let result = v;
    for (let i = 0; i < 1000; i++) {
      result = Math.sqrt(v * i);
    }
    return result.toFixed(2);
  };

  // Dynamic state
  let currentFormatter = 0;
  let formatterEnabled = true;
  let currentPrefix = '';
  let currentSuffix = '';

  // Array of formatters for dynamic testing
  const formatters = [
    { name: 'Default', fn: defaultFormatter },
    { name: 'Number', fn: numberFormatter },
    { name: 'Currency', fn: currencyFormatter },
    { name: 'Percent', fn: percentFormatter },
    { name: 'Index', fn: indexFormatter },
    { name: 'HTML', fn: htmlFormatter },
    { name: 'Locale', fn: localeFormatter }
  ];

  function cycleFormatter() {
    currentFormatter = (currentFormatter + 1) % formatters.length;
  }

  function toggleFormatter() {
    formatterEnabled = !formatterEnabled;
  }

  function togglePrefix() {
    currentPrefix = currentPrefix ? '' : 'Value: ';
  }

  function toggleSuffix() {
    currentSuffix = currentSuffix ? '' : ' units';
  }
</script>

<div class="slider-list">
  <h2>Basic Formatter Tests</h2>
  <h3>Default formatter - no formatting applied</h3>
  <RangeSlider id="default-formatter" pips all="label" />

  <h3>Number formatter - displays values with 2 decimal places</h3>
  <RangeSlider id="number-formatter" pips all="label" formatter={numberFormatter} />

  <h3>Currency formatter - displays values with $ prefix and 2 decimal places</h3>
  <RangeSlider id="currency-formatter" pips all="label" formatter={currencyFormatter} />

  <h3>Percent formatter - displays values as percentages with 1 decimal place</h3>
  <RangeSlider id="percent-formatter" pips all="label" formatter={percentFormatter} />

  <h3>Index formatter - displays pip number and value</h3>
  <RangeSlider id="index-formatter" pips all="label" formatter={indexFormatter} />

  <h3>HTML formatter - displays values with HTML formatting</h3>
  <RangeSlider id="html-formatter" pips all="label" formatter={htmlFormatter} />

  <h3>Locale formatter - displays values with locale formatting</h3>
  <RangeSlider id="locale-formatter" pips all="label" formatter={localeFormatter} />

  <h2>Edge Cases</h2>
  <h3>Large numbers - handles values in millions</h3>
  <RangeSlider
    id="large-numbers"
    pips
    all="label"
    min={0}
    max={5000000}
    formatter={(v) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(v)}
  />

  <h3>Negative numbers - handles negative values</h3>
  <RangeSlider id="negative-numbers" pips all="label" formatter={numberFormatter} min={-100} max={0} />

  <h3>Decimal numbers - handles values with decimal places</h3>
  <RangeSlider id="decimal-numbers" pips all="label" formatter={numberFormatter} step={0.25} />

  <h3>Extreme values - handles very large positive and negative values</h3>
  <RangeSlider id="extreme-values" pips all="label" formatter={numberFormatter} min={-1000000} max={1000000} />

  <h2>Dynamic Formatter Tests</h2>
  <div class="dynamic-container">
    <h3>Dynamic formatter - tests runtime formatter changes</h3>
    <RangeSlider
      id="dynamic-formatter"
      pips
      all="label"
      formatter={formatters[currentFormatter].fn}
      prefix={currentPrefix}
      suffix={currentSuffix}
    />
    <p>Current formatter: {formatters[currentFormatter].name}</p>
    <div class="controls">
      <button id="btn_change" on:click={cycleFormatter}>Change Formatter</button>
      <button id="btn_prefix" class:btn-primary={currentPrefix} on:click={togglePrefix}>
        {currentPrefix ? 'Remove' : 'Add'} Prefix
      </button>
      <button id="btn_suffix" class:btn-primary={currentSuffix} on:click={toggleSuffix}>
        {currentSuffix ? 'Remove' : 'Add'} Suffix
      </button>
    </div>
  </div>

  <h3>Enable/Disable formatter - tests formatter toggle</h3>
  <RangeSlider id="formatter-toggle" pips all="label" formatter={formatterEnabled ? numberFormatter : (v) => v} />
  <div class="controls">
    <button id="btn_toggle" class:btn-primary={formatterEnabled} on:click={toggleFormatter}>
      {formatterEnabled ? 'Disable' : 'Enable'} Formatter
    </button>
  </div>

  <h2>Failing Cases</h2>
  <h3>No pips - formatter should not be applied</h3>
  <RangeSlider id="no-pips" formatter={currencyFormatter} />

  <h3>Pips without labels - formatter should not be visible</h3>
  <RangeSlider id="pips-no-labels" pips formatter={currencyFormatter} />

  <h3>Pips with all=false - formatter should not be visible</h3>
  <RangeSlider id="pips-all-false" pips all={false} formatter={currencyFormatter} />

  <h3>First pip only - should only show first pip label</h3>
  <RangeSlider id="first-pip-only" pips first="label" formatter={currencyFormatter} />

  <h3>Last pip only - should only show last pip label</h3>
  <RangeSlider id="last-pip-only" pips last="label" formatter={currencyFormatter} />

  <h3>Rest pips only - should only show rest pip labels</h3>
  <RangeSlider id="rest-pip-only" pips rest="label" formatter={currencyFormatter} />

  <h3>Pips with selective labels (first/last only)</h3>
  <RangeSlider id="pips-selective" pips first="label" last="label" formatter={currencyFormatter} />

  <h3>Pips with rest only</h3>
  <RangeSlider id="pips-rest-only" pips rest="label" formatter={currencyFormatter} />

  <h2>Performance Tests</h2>
  <h3>Heavy formatter - tests performance with computationally expensive formatter</h3>
  <RangeSlider id="heavy-formatter" pips all="label" formatter={heavyFormatter} />

  <h2>Formatter Context Tests</h2>
  <h3>Reversed mode - tests percentage calculation in reversed orientation</h3>
  <RangeSlider id="reversed-mode" pips all="label" reversed formatter={percentFormatter} />

  <h3>Vertical mode - tests formatting in vertical orientation</h3>
  <RangeSlider id="vertical-mode" pips all="label" vertical formatter={percentFormatter} />

  <h3>Custom range - tests formatting with non-standard min/max values</h3>
  <RangeSlider id="custom-range" pips all="label" min={-100} max={200} formatter={percentFormatter} />

  <h3>Step values - tests formatting with non-unit step values</h3>
  <RangeSlider id="step-values" pips all="label" step={5} formatter={percentFormatter} />
</div>
