<script>

  import RangeSlider from 'svelte-range-slider-pips';
  import prettyBytes from 'pretty-bytes';

  let values = [1];

  // format the value to a human readable string
  const formatter = (value) => {
    const gigabyte = 1000000000;
    return prettyBytes( toGigabytes(value) * gigabyte );
    // https://github.com/sindresorhus/pretty-bytes
  }

  // take the input value from the range, and then
  // power it so it outputs in a logarithmic scale
  const toGigabytes = (value) => {
    if (value <= 10) return value;
    const MOD = (val, div) => val % div;
    const POW = (base, exp) => Math.pow(base, exp);
    const CEIL = (val) => Math.ceil(val);
    const MAX = (val, val2) => Math.max(val, val2);
    const MODULO = MAX( 1, value - 1 - MOD(value - 11, 9 ));
    const POWER = POW( 10, CEIL( MODULO / 10 ));
    return ( value - MODULO ) * POWER + POWER;
  }

</script>

<!-- hide -->
<table>
  <thead>
    <tr>
      <th>Input</th>
      <th>Readable</th>
      <th>Raw</th>
    </tr>
    <tr>
      <td>values[0]</td>
      <td>formatter()</td>
      <td>toGigabytes()</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>{values[0]}</code></td>
      <td><code>{formatter(values[0])}</code></td>
      <td><code>{toGigabytes(values[0])}</code></td>
    </tr>
  </tbody>
</table>

<!-- endhide -->

<RangeSlider {formatter} float pips all="label" min={1} max={55} pipstep={9} range="min" bind:values />

<code data-values title="The output slider values">{toGigabytes(values[0])}</code>



<style hide>
  table tr td,
  table tr th {
    text-align: center;
  }
</style>