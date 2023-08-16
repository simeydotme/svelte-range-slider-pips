<script>
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [2.5, 17.5];
  let bigValues = [2000, 8000];

  let values1 = [10];
  let values2 = [10];
  let values3 = [10];
  let values4 = [10];
  let values5 = [10];
  let values6 = [10];
  let values7 = [10];
  let values8 = [10];
  let values9 = [10];
  let values10 = [10];
  let values11 = [10];
  let values12 = [10];
  let values13 = [10];
  let values14 = [10];
  let values15 = [10];
</script>



<div class="slider-table">

  <table>
    <thead>
      <th><code>step</code></th>
      <th><code>pipstep</code></th>
      <th>Result</th>
      <th></th>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>1</td>
        <td><RangeSlider pips all="label" max={20} step={1} pipstep={1} range="min" bind:values={values1} /></td>
        <td><code>{values1}</code></td>
      </tr>
      <tr>
        <td>2</td>
        <td>1</td>
        <td><RangeSlider pips all="label" max={20} step={2} pipstep={1} range="min" bind:values={values2} /></td>
        <td><code>{values2}</code></td>
      </tr>
      <tr>
        <td>1</td>
        <td>2</td>
        <td><RangeSlider pips all="label" max={20} step={1} pipstep={2} range="min" bind:values={values3} /></td>
        <td><code>{values3}</code></td>
      </tr>
      <tr>
        <td>2</td>
        <td>2</td>
        <td><RangeSlider pips all="label" max={20} step={2} pipstep={2} range="min" bind:values={values4} /></td>
        <td><code>{values4}</code></td>
      </tr>
      <tr>
        <td>2.5</td>
        <td>2</td>
        <td><RangeSlider pips all="label" max={20} step={2.5} pipstep={2} range="min" bind:values={values8} /></td>
        <td><code>{values8}</code></td>
      </tr>
      <tr>
        <td>2</td>
        <td>2.5</td>
        <td><RangeSlider pips all="label" max={20} step={2} pipstep={2.5} range="min" bind:values={values9} /></td>
        <td><code>{values9}</code></td>
      </tr>
      <tr>
        <td>2.5</td>
        <td>2.5</td>
        <td><RangeSlider pips all="label" max={20} step={2.5} pipstep={2.5} range="min" bind:values={values13} /></td>
        <td><code>{values13}</code></td>
      </tr>
      <tr>
        <td>3</td>
        <td>2</td>
        <td><RangeSlider pips all="label" max={20} step={3} pipstep={2} range="min" bind:values={values5} /></td>
        <td><code>{values5}</code></td>
      </tr>
      <tr>
        <td>2</td>
        <td>3</td>
        <td><RangeSlider pips all="label" max={20} step={2} pipstep={3} range="min" bind:values={values6} /></td>
        <td><code>{values6}</code></td>
      </tr>
      <tr>
        <td>3</td>
        <td>3</td>
        <td><RangeSlider pips all="label" max={20} step={3} pipstep={3} range="min" bind:values={values7} /></td>
        <td><code>{values7}</code></td>
      </tr>
      <tr>
        <td>5</td>
        <td>0.5</td>
        <td><RangeSlider pips all="label" max={20} step={5} pipstep={0.5} range="min" bind:values={values10} /></td>
        <td><code>{values10}</code></td>
      </tr>
      <tr>
        <td>0.5</td>
        <td>5</td>
        <td><RangeSlider pips all="label" max={20} step={0.5} pipstep={5} range="min" bind:values={values11} /></td>
        <td><code>{values11}</code></td>
      </tr>
      <tr>
        <td>0.5</td>
        <td>0.5</td>
        <td><RangeSlider pips all="label" max={20} step={0.5} pipstep={0.5} range="min" bind:values={values12} /></td>
        <td><code>{values12}</code></td>
      </tr>
      <tr>
        <td>3</td>
        <td>5</td>
        <td><RangeSlider pips all="label" max={20} step={3} pipstep={5} range="min" bind:values={values14} /></td>
        <td><code>{values14}</code></td>
      </tr>
      <tr>
        <td>5</td>
        <td>3</td>
        <td><RangeSlider pips all="label" max={20} step={5} pipstep={3} range="min" bind:values={values15} /></td>
        <td><code>{values15}</code></td>
      </tr>
    </tbody>
  </table>

</div>
