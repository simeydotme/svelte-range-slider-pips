<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  let value = 40;
  let values = [40, 60];
  let float = false;
  let rangeFloat = false;
  let vertical = false;
  let reversed = false;
  let disabled = false;
  let hoverable = true;
  let draggy = true;

  // Custom formatters
  const handleFormatter = (v: number) => `$${v.toFixed(2)}`;
  const rangeFormatter = (v1: number, v2: number) => `From: $${v1.toFixed(2)} to $${v2.toFixed(2)}`;
  const htmlFormatter = (v: number) => `<strong>${v}</strong>`;
  const htmlRangeFormatter = (v1: number, v2: number) => `<strong>${v1}</strong> to <em>${v2}</em>`;

  // For testing large numbers
  let largeValues = [1000000, 2000000];
  // For testing negative numbers
  let negativeValues = [-50, -20];
  // For testing decimals
  let decimalValues = [10.25, 20.75];

  // For testing keyboard navigation
  let keyboardValues = [30, 70];
</script>

<div class="slider-list">
  <h5>Basic Float Tests</h5>
  <RangeSlider id="basic-float" {value} float />
  <RangeSlider id="basic-no-float" {value} />

  <h5>Basic RangeFloat Tests</h5>
  <RangeSlider id="basic-range-float" range {values} rangeFloat />
  <RangeSlider id="basic-no-range-float" range {values} />

  <h5>Formatted Floats</h5>
  <RangeSlider id="formatted-float" range {values} float rangeFloat prefix="$" suffix="%" />
  <RangeSlider id="custom-formatted" range {values} float rangeFloat {handleFormatter} {rangeFormatter} />
  <RangeSlider
    id="html-formatted"
    range
    {values}
    float
    rangeFloat
    handleFormatter={htmlFormatter}
    rangeFormatter={htmlRangeFormatter}
  />

  <h5>Edge Cases</h5>
  <RangeSlider id="large-numbers" range values={largeValues} float rangeFloat min={0} max={5000000} />
  <RangeSlider id="negative-numbers" range values={negativeValues} float rangeFloat min={-100} max={0} />
  <RangeSlider id="decimal-numbers" range values={decimalValues} float rangeFloat step={0.25} />
  <RangeSlider id="large-range-float" range values={largeValues} rangeFloat min={0} max={5000000} />
  <RangeSlider id="negative-range-float" range values={negativeValues} rangeFloat min={-100} max={0} />
  <RangeSlider id="decimal-range-float" range values={decimalValues} rangeFloat step={0.25} />

  <h5>Float + RangeFloat Interactions</h5>
  <RangeSlider id="float-interactions" range {values} float rangeFloat hoverable />
  <RangeSlider id="float-z-index" range {values} float rangeFloat hoverable draggy />

  <h5>Orientation Tests</h5>
  <RangeSlider id="vertical-float" values={[10, 50, 90]} float rangeFloat vertical />
  <RangeSlider id="vertical-range-float" range values={[20, 80]} rangeFloat vertical draggy />
  <RangeSlider id="reversed-float" range {values} float rangeFloat reversed />
  <RangeSlider id="reversed-vertical" range {values} float rangeFloat reversed vertical />

  <h5>Interactive State Tests</h5>
  <RangeSlider id="disabled-float" range {values} float rangeFloat {disabled} />
  <RangeSlider id="hoverable-float" range {values} float rangeFloat {hoverable} />
  <RangeSlider id="draggy-float" range {values} float rangeFloat {draggy} />
  <RangeSlider id="focus-float" range {values} float rangeFloat />

  <h5>Accessibility Tests</h5>
  <RangeSlider
    id="a11y-test"
    range
    values={keyboardValues}
    float
    rangeFloat
    ariaLabels={['First handle', 'Second handle']}
  />

  <h5>Dynamic Toggle Tests</h5>
  <div class="toggle-container">
    <RangeSlider id="dynamic-float" range {values} {float} {rangeFloat} {vertical} {reversed} />
    <div class="controls">
      <button class:btn-primary={float} on:click={() => (float = !float)}>Toggle float ({float ? 'on' : 'off'})</button>
      <button class:btn-primary={rangeFloat} on:click={() => (rangeFloat = !rangeFloat)}
        >Toggle rangeFloat ({rangeFloat ? 'on' : 'off'})</button
      >
      <button class:btn-primary={vertical} on:click={() => (vertical = !vertical)}
        >Toggle vertical ({vertical ? 'on' : 'off'})</button
      >
      <button class:btn-primary={reversed} on:click={() => (reversed = !reversed)}
        >Toggle reversed ({reversed ? 'on' : 'off'})</button
      >
    </div>
  </div>
</div>

<style>
  :global(.vertical) {
    height: 200px;
  }
</style>
