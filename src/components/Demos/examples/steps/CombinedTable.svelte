<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [2.5, 17.5];
  let bigValues = [2000, 8000];

  // let values1 = [10];
  // let values2 = [10];
  // let values3 = [10];
  // let values4 = [10];
  // let values5 = [10];
  // let values6 = [10];
  // let values7 = [10];
  // let values8 = [10];
  // let values9 = [10];
  // let values10 = [10];
  // let values11 = [10];
  // let values12 = [10];
  // let values13 = [10];
  // let values14 = [10];
  // let values15 = [10];

  const table = [
    { step: 1, pipstep: 1, value: 1, min: -10, max: 10 },
    { step: 2, pipstep: 1, value: 1, min: -10, max: 10 },
    { step: 1, pipstep: 2, value: 1, min: -10, max: 10 },
    { step: 2, pipstep: 2, value: 1, min: -10, max: 10 },
    { step: 2.5, pipstep: 2, value: 1, min: -10, max: 10 },
    { step: 2, pipstep: 2.5, value: 1, min: -10, max: 10 },
    { step: 2.5, pipstep: 2.5, value: 1, min: -10, max: 10 },
    { step: 3, pipstep: 2, value: 1, min: -10, max: 10 },
    { step: 2, pipstep: 3, value: 1, min: -10, max: 10 },
    { step: 3, pipstep: 3, value: 1, min: -10, max: 10 },
    { step: 5, pipstep: 0.5, value: 1, min: -10, max: 10 },
    { step: 0.5, pipstep: 5, value: 1, min: -10, max: 10 },
    { step: 0.5, pipstep: 0.5, value: 1, min: -1, max: 1 },
    { step: 3, pipstep: 5, value: 1, min: -10, max: 10 },
    { step: 5, pipstep: 3, value: 1, min: -10, max: 10 },
  ]

</script>



<div class="slider-table">
  <table>
    <thead>
      <tr>
        <th><code>step</code></th>
        <th><code>pipstep</code></th>
        <th>Result</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each table as row}
        {@const { step, pipstep, value, min, max } = row}
        <tr>
          <td>{row.step}</td>
          <td>{row.pipstep}</td>
          <td><RangeSlider pips float all="label" {min} {max} {step} {pipstep} range="min" bind:value={row.value} /></td>
          <td><code>{row.value}</code></td>
        </tr>
      {/each}
    </tbody>
  </table>

</div>