<script>

  import RangeSlider from 'svelte-range-slider-pips';
  let value = 50;
  let springStiffness = 0.15;
  let springDamping = 0.4;

  const jump = () => value > 50 ? value = 5 : value = 95;

</script>

<RangeSlider {value} springValues={{ stiffness: springStiffness, damping: springDamping }} />

<div data-grid>

  <pre>springValues={`{{ stiffness: ${springStiffness}, damping: ${springDamping} }}`}</pre>
  
  <RangeSlider id='stiffness' class='modifier' bind:value={springStiffness} min={0.01} max={1} step={0.01} on:stop={jump} float />
  <label for='stiffness'>Stiffness</label>
  
  <RangeSlider id='damping' class='modifier' bind:value={springDamping} min={0.01} max={1} step={0.01} on:stop={jump} float />
  <label for='damping'>Damping</label>

</div>

<code data-values title="The output slider values">{springStiffness} {springDamping}</code>


<style hide>
  [data-grid] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    text-align: center;
  }
  [data-grid] [for='springEnabled'] {
    grid-row: 1;
    grid-column: 1 / -1;
    justify-self: center;
  }
  [data-grid] [for='stiffness'] {
    grid-column: 1;
  }
  [data-grid] [for='damping'] {
    grid-column: 2;
  }
  [data-grid] [for='stiffness'], [for='damping'] {
    grid-row: 3;
    justify-self: center;
    margin: 0;
  }
  [data-grid] :global(.rangeSlider) {
    margin: 2em 0 0!important;
  }
  [data-grid] :global(.modifier .rangeFloat) {
    opacity: 1;
    translate: -50% 0;;
  }
  pre {
    grid-column: 1 / -1
  }
</style>