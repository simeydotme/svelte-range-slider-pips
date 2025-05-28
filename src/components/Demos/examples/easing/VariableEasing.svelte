<script>

  import RangeSlider from 'svelte-range-slider-pips';
  let values = [50];
  let springEnabled = true;
  let springStiffness = [0.15];
  let springDamping = [0.4];

  const updateValues = (e) => {
    values = [Math.round(Math.random() * 100)];
  }

</script>

  <RangeSlider {values} spring={springEnabled} springValues={{ stiffness: springStiffness, damping: springDamping }} />

<div data-grid>
  
  <label for="springEnabled"><input id="springEnabled" type="checkbox" bind:checked={springEnabled} /> Enable Spring?</label>
  
  <label for='stiffness'>Stiffness</label>
  <RangeSlider id='stiffness' bind:values={springStiffness} min={0.01} max={1} step={0.01} on:stop={updateValues} float />
  
  <label for='damping'>Damping</label>
  <RangeSlider id='damping' bind:values={springDamping} min={0.01} max={1} step={0.01} on:stop={updateValues} float />
  
  <pre>
    spring={`{${springEnabled}}`} springValues={`{{ stiffness: ${springStiffness}, damping: ${springDamping} }}`}</pre>

</div>

<code data-values title="The output slider values">{springStiffness} {springDamping}</code>


<style hide>
  [data-grid] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
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
    grid-row: 2;
    justify-self: center;
  }
  [data-grid] :global(.rangeSlider) {
    margin: 0 0 2em!important;
  }
  pre {
    grid-column: 1 / -1
  }
</style>