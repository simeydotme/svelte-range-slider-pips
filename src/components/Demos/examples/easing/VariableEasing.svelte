<script>

  import RangeSlider from 'svelte-range-slider-pips';
  import { spring } from 'svelte/motion'
  let values = [30,70];
  let springStiffness = [0.15];
  let springDamping = [0.4];

  const updateValues = (e) => {
    const val1 = Math.round(Math.random() * 100);
    const val2 = 100 - val1;
    values = [val1, val2];
  }

</script>

{#key springStiffness && springDamping}
  <RangeSlider {values} springValues={{ stiffness: springStiffness, damping: springDamping }} />
{/key}

<div data-grid>
  <label for='stiffness'>Stiffness</label>
  <RangeSlider id='stiffness' bind:values={springStiffness} min={0.01} max={1} step={0.01} on:stop={updateValues} float />
  <label for='damping'>Damping</label>
  <RangeSlider id='damping' bind:values={springDamping} min={0.01} max={1} step={0.01} on:stop={updateValues} float />
  <pre>springValues={`{{ stiffness: ${springStiffness}, damping: ${springDamping} }}`}</pre>
</div>

<code data-values title="The output slider values">{springStiffness} {springDamping}</code>


<style hide>
  [data-grid] {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    text-align: center;
  }
  [data-grid] [for='stiffness'] {
    grid-column: 1;
  }
  [data-grid] [for='damping'] {
    grid-column: 2;
  }
  [data-grid] [for='stiffness'], [for='damping'] {
    grid-row: 1;
    justify-self: center;
  }
  [data-grid] :global(.rangeSlider) {
    margin: 0 0 1em;
  }
  pre {
    grid-column: 1 / -1
  }
</style>