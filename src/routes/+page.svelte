<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  import type { Formatter } from '$lib/types.js';

  let reversed = false;
  let disabled = false;
  let hoverable = true;

  let values = [21.3, 40, 60, 80];
  let dynamic = [0, 50];
  let pushy = [-20, 20];
  let pushy2 = [-20, 20];
  let pushy3 = [-5, 5];
  let pushy4 = [-20, 20];
  let pushy5 = [-20, 20];
  let pushy6 = [-40, 40];
  let draggy4 = [-20, 20];
  let draggy5 = [-20, 20];
  let draggy6 = [-40, 40];
  let peoFloat = true;
  let peoRangeFloat = false;

  let vrange = [20, 80];

  const num = new Intl.NumberFormat('en-US');
  const numzh = new Intl.NumberFormat('zh-Hans-CN-u-nu-hanidec');
  const formatter = (v: number) => {
    return num.format(v);
  };

  let day = [3];
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Happy Days'];
  const dayFormat: Formatter = (v) => days[v];
  const dayFormatCn = (v: number) => {
    if (v === 6) {
      return '星期日';
    }
    return '星期' + numzh.format(v + 1);
  };

  let perc1 = [5];
  let perc2 = [100 - perc1[0]];
  $: perc2max = 100 - perc1[0];

  let big = [500, 1000];
  let hramp: Formatter = (v, i, p) => {
    return (v * ((p / 100) * (p / 100))).toFixed(0) + ' (' + p + '%)';
  };
  let ramp: Formatter = (v, i, p) => {
    return (v * ((p / 100) * (p / 100))).toFixed(0);
  };

  let hue = [244];
  $: lightColor = `hsl(${Math.round(hue[0]) - 10}, 65%, 70%)`;
  $: color = `hsl(${Math.round(hue[0])}, 63%, 54%)`;

  let zero = [2, 10];
  let zeromin = 0;
  let zeromax = 0;

  let arrayPush = [11, 99];
  let pushValues = () => {
    values.push(Math.random() * 100);
    values = values;
  };
  let popValues = () => {
    values.pop();
    values = values;
  };

  let boundSlider;
  onMount(() => {
    console.log('slider is bound: ', boundSlider);
    setTimeout(() => {
      boundSlider.style.outline = '1px dotted black';
      boundSlider.style.outlineOffset = '15px';
    }, 500);
  });

  let decimals = [0.003, 0.123];
  let decimals2 = [-0.133, 0.444444444];

  let boundStore = writable([5, 15]);
  let store_updates = 0;
  const unsubscribe = boundStore.subscribe(() => {
    store_updates++;
  });

  onDestroy(unsubscribe);

  let objectValueBind = { value: 20 };
  let objectValuesBind = { values: [20, 40] };
  let objectValuesBind2 = [{ value: 20 }, { value: 20 }];

  let errorValueBind = [20];
  let errorValueObjectBind = { value: 20 };
  let errorValueStringBind = '20';
  let errorValueBooleanBind = true;

  let errorValuesBind = 20;
  let errorValuesObjectBind = { value: 20 };
  let errorValuesStringBind = '20';
  let errorValuesBooleanBind = true;

  let valueBind = 20;
  let limitBind = [10, 30];
  let limitBind2 = [10, 30];
  let limitBind3 = [10, 30];
  let limitBind4 = [10, 30];
</script>

<header>
  <button
    on:click={() => {
      hoverable = !hoverable;
    }}>hoverable <input type="checkbox" checked={hoverable} /></button
  >
  <button
    on:click={() => {
      disabled = !disabled;
    }}>disabled <input type="checkbox" checked={disabled} /></button
  >
  <button
    on:click={() => {
      reversed = !reversed;
    }}>reverse sliders <input type="checkbox" checked={reversed} /></button
  >
</header>

<div class="content">
  <h2>Vertical Tests</h2>

  <section class="flex justify-between">
    <RangeSlider vertical pips all="label" {reversed} {hoverable} {disabled} />
    <RangeSlider bind:values={vrange} vertical pips all="label" float {reversed} {hoverable} {disabled} />
    <div>
      <RangeSlider bind:values={vrange} vertical range pips all="label" float {reversed} {hoverable} {disabled} />
      <span class="transform-gpu">{vrange}</span>
    </div>
    <RangeSlider vertical range="min" values={[10]} pips all float {reversed} {hoverable} {disabled} />
    <RangeSlider vertical range="max" values={[30]} pips float {reversed} {hoverable} {disabled} />
  </section>

  <h2>Spring & Colors Test</h2>

  <table>
    <tr>
      <th class="p-1 w-16">stiffness</th>
      <th class="p-1 w-16">damping</th>
      <th class="text-center">result</th>
    </tr>
    <tr>
      <td><code>0.75</code></td>
      <td><code>0.1</code></td>
      <td
        ><RangeSlider
          id="test-id3"
          springValues={{ stiffness: 0.75, damping: 1 }}
          values={[20, 40, 60, 80]}
          {reversed}
          {hoverable}
          {disabled}
        /></td
      >
    </tr>
    <tr>
      <td><code>0.1</code></td>
      <td><code>0.85</code></td>
      <td
        ><RangeSlider
          id="test-id2"
          springValues={{ stiffness: 0.1, damping: 0.857 }}
          values={[20, 40, 60, 80]}
          {reversed}
          {hoverable}
          {disabled}
        /></td
      >
    </tr>
    <tr>
      <td><code>0.05</code></td>
      <td><code>0.05</code></td>
      <td
        ><RangeSlider
          id="test-id"
          springValues={{ stiffness: 0.05, damping: 0.05 }}
          values={[20, 40, 60, 80]}
          {reversed}
          {hoverable}
          {disabled}
        /></td
      >
    </tr>
  </table>

  <h2>Default with float</h2>
  <RangeSlider float {reversed} {hoverable} {disabled} />
  <RangeSlider float {reversed} {hoverable} {disabled} bind:slider={boundSlider} />

  <h2>Pips & Floats</h2>
  <RangeSlider float pips all="label" {reversed} {hoverable} {disabled} />
  <RangeSlider float pips first="label" last="label" {reversed} {hoverable} {disabled} />
  <h2>trim/align</h2>
  <RangeSlider values={[-10, 12, 103]} float pips step={5} all="label" {reversed} {hoverable} {disabled} />
  <h2>events</h2>
  <RangeSlider
    float
    pips
    first="label"
    last="label"
    rest="label"
    on:start={(e) => {
      console.log('start', e.detail);
    }}
    on:stop={(e) => {
      console.log('stop', e.detail);
    }}
    on:change={(e) => {
      console.log('change', e.detail);
    }}
    {reversed}
    {hoverable}
    {disabled}
  />

  <h2>range</h2>
  <h3>Handles block each other</h3>
  <RangeSlider
    range
    min={-50}
    max={50}
    bind:values={pushy}
    float
    rangeFloat
    pips
    all="label"
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{pushy}</span>
  <RangeSlider
    range
    min={-50}
    max={50}
    bind:values={pushy2}
    rangeGapMin={10}
    rangeGapMax={30}
    float
    rangeFloat
    pips
    all="label"
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{pushy2}</span>
  <RangeSlider
    range
    min={-50}
    max={50}
    bind:values={pushy3}
    rangeGapMin={15}
    step={1.5}
    rangeGapMax={22}
    limits={[-30, 30]}
    float
    rangeFloat
    pips
    all="label"
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{pushy3}</span>
  <h3>Handles push each other</h3>
  <RangeSlider
    range
    min={-50}
    max={50}
    pushy
    bind:values={pushy4}
    pips
    all="label"
    float={peoFloat}
    rangeFloat={peoRangeFloat}
    on:change={(e) => {
      if (e.detail.values[1] - e.detail.values[0] < 15) {
        peoFloat = false;
        peoRangeFloat = true;
      } else {
        peoFloat = true;
        peoRangeFloat = false;
      }
    }}
    rangeFormatter={(v1, v2, p1, p2) => v1 + ' ~ ' + v2 + '  (' + p1 + '% ~ ' + p2 + '%)'}
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{pushy4}</span>
  <RangeSlider
    range
    min={-50}
    max={50}
    pushy
    bind:values={pushy5}
    rangeGapMax={30}
    rangeGapMin={7}
    pips
    step={1}
    all="label"
    float
    rangeFloat
    prefix="$"
    suffix=".00"
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{pushy5}</span>
  <RangeSlider
    range
    min={-50}
    max={50}
    step={1.8}
    pushy
    bind:values={pushy6}
    limits={[-20, 20]}
    rangeGapMax={7}
    rangeGapMin={7}
    pips
    all="label"
    float
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{pushy6}</span>
  <h3>Range is Draggy</h3>
  <RangeSlider
    range
    draggy
    min={-50}
    max={50}
    pushy
    bind:values={draggy4}
    pips
    rangeFloat
    rangeFormatter={(v1, v2, p1, p2) => v1 + ' ~ ' + v2 + '  (' + p1 + '% ~ ' + p2 + '%)'}
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{draggy4}</span>
  <RangeSlider
    range
    draggy
    min={-50}
    max={50}
    step={2.7}
    pipstep={2.5}
    pushy
    bind:values={draggy5}
    rangeGapMin={10}
    rangeGapMax={20}
    pips
    all="label"
    rangeFloat
    {reversed}
    {hoverable}
    {disabled}
    on:start={(e) => {
      console.log('start', e.detail);
    }}
    on:stop={(e) => {
      console.log('stop', e.detail);
    }}
    on:change={(e) => {
      console.log('change', e.detail);
    }}
  />
  <span class="transform-gpu">{draggy5}</span>
  <RangeSlider
    range
    min={-50}
    max={50}
    step={2}
    pushy
    draggy
    bind:values={draggy6}
    limits={[-20, 20]}
    rangeGapMin={8}
    rangeGapMax={8}
    pips
    all="label"
    float
    {reversed}
    {hoverable}
    {disabled}
    on:start={(e) => {
      console.log('start', e.detail);
    }}
    on:stop={(e) => {
      console.log('stop', e.detail);
    }}
    on:change={(e) => {
      console.log('change', e.detail);
    }}
  />
  <span class="transform-gpu">{draggy6}</span>

  <h2>min range</h2>
  <RangeSlider range="min" values={[65]} pips all="label" float {reversed} {hoverable} {disabled} />
  <h2>max range</h2>
  <RangeSlider range="max" values={[35]} pips all="label" float {reversed} {hoverable} {disabled} />

  <h2>limits</h2>
  <table>
    <tr>
      <th width="50">range</th>
      <th width="50">limits</th>
      <th>slider</th>
      <th width="50">values</th>
    </tr>
    <tr>
      <td><code>true</code></td>
      <td><code>null</code></td>
      <td>
        <RangeSlider
          bind:values={limitBind}
          range
          limits={null}
          pips
          all="label"
          pushy
          float
          {reversed}
          {hoverable}
          {disabled}
        />
      </td>
      <td>
        {limitBind}
      </td>
    </tr>
    <tr>
      <td><code>false</code></td>
      <td><code>[20,80]</code></td>
      <td>
        <RangeSlider
          bind:values={limitBind2}
          limits={[20, 80]}
          pips
          all="label"
          pushy
          float
          {reversed}
          {hoverable}
          {disabled}
        />
      </td>
      <td>
        {limitBind2}
      </td>
    </tr>
    <tr>
      <td><code>true</code></td>
      <td><code>[20, 80]</code></td>
      <td>
        <RangeSlider
          id="limit-test"
          bind:values={limitBind2}
          range
          limits={[20, 80]}
          pips
          all="label"
          pushy
          float
          {reversed}
          {hoverable}
          {disabled}
        />
      </td>
      <td>
        {limitBind2}
      </td>
    </tr>
    <tr>
      <td><code>min</code></td>
      <td><code>[20, 80]</code></td>
      <td>
        <RangeSlider
          bind:values={limitBind3}
          range="min"
          limits={[20, 80]}
          pips
          all="label"
          pushy
          float
          {reversed}
          {hoverable}
          {disabled}
        />
      </td>
      <td>
        {limitBind3}
      </td>
    </tr>
    <tr>
      <td><code>max</code></td>
      <td><code>[20, 80]</code></td>
      <td>
        <RangeSlider
          bind:values={limitBind4}
          range="max"
          limits={[20, 80]}
          pushy
          float
          {reversed}
          {hoverable}
          {disabled}
        />
      </td>
      <td>
        {limitBind4}
      </td>
    </tr>
  </table>

  <h2>step & pipstep</h2>
  <RangeSlider float pips step={10} pipstep={1} {reversed} {hoverable} {disabled} />
  <RangeSlider float pips step={10} pipstep={2} {reversed} {hoverable} {disabled} />
  <RangeSlider float pips step={10} pipstep={0.25} {reversed} {hoverable} {disabled} />
  <RangeSlider
    float
    pips
    step={0.1}
    min={dynamic[0]}
    max={dynamic[1]}
    on:start={(e) => {
      console.log('start', e.detail);
    }}
    on:stop={(e) => {
      console.log('stop', e.detail);
    }}
    on:change={(e) => {
      console.log('change', e.detail);
    }}
    {reversed}
    {hoverable}
    {disabled}
  />

  <RangeSlider
    float
    pips
    first="label"
    last="label"
    rest
    pipstep={1}
    bind:values={dynamic}
    range
    {reversed}
    {hoverable}
    {disabled}
  />

  <h2>Prefix</h2>
  <RangeSlider
    prefix="$"
    range
    values={[20, 80]}
    float
    pips
    first="label"
    last="label"
    {reversed}
    {hoverable}
    {disabled}
  />
  <h2>Prefix & Suffix, color</h2>
  <RangeSlider
    id="clr-test"
    prefix="~"
    suffix="m²"
    {formatter}
    range
    values={[100, 3000]}
    min={100}
    max={3000}
    step={200}
    float
    pips
    all="label"
    {reversed}
    {hoverable}
    {disabled}
  />
  <div class="contents" style="--range-handle-focus: {color}; --range-handle: {lightColor}">
    <h2>Formatters</h2>
    <RangeSlider
      handleFormatter={(v, i) => `${v}% O²`}
      formatter={(v, i) => `${v}% O²`}
      step={1}
      float
      pips
      first="label"
      last="label"
      values={[25, 50, 75]}
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      handleFormatter={(v, i) => `v: ${v}, i: ${i}`}
      formatter={(v, i) => `v: ${v}, i: ${i}`}
      step={10}
      float
      pips
      all="label"
      values={[25, 50, 75]}
      {reversed}
      {hoverable}
      {disabled}
    />

    <RangeSlider
      bind:values={day}
      min={0}
      max={6}
      formatter={dayFormat}
      float
      pips
      first="label"
      last="label"
      rest="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:values={day}
      min={0}
      max={6}
      formatter={dayFormatCn}
      float
      pips
      first="label"
      last="label"
      rest="label"
      {reversed}
      {hoverable}
      {disabled}
    />

    <span class="transform-gpu">{dayFormatCn(day[0])} | {dayFormat(day[0])}</span>

    <RangeSlider
      bind:values={hue}
      max={360}
      range="min"
      float
      formatter={(v) => color}
      {reversed}
      {hoverable}
      {disabled}
    />

    <RangeSlider bind:values={perc1} min={0} max={50} pips all="label" float {reversed} {hoverable} {disabled} />
    <RangeSlider bind:values={perc2} min={0} max={perc2max} pips all="label" float {reversed} {hoverable} {disabled} />
    <hr />
    <span class="transform-gpu">{perc1} / {perc2}</span>
  </div>

  <h2>BIG, ramped value</h2>
  <RangeSlider
    bind:values={big}
    min={0}
    max={10000}
    pips
    first="label"
    last="label"
    float
    formatter={ramp}
    handleFormatter={hramp}
    {reversed}
    {hoverable}
    {disabled}
  />
  <table>
    <tr>
      <th>real value</th><th>formatted (ramp(v,i,p))</th>
    </tr>
    <tr>
      <td><span class="transform-gpu">{big}</span></td><td
        >{[
          ramp(big[0], 0, parseFloat(((big[0] / 10000) * 100).toFixed(1))),
          ramp(big[1], 0, parseFloat(((big[1] / 10000) * 100).toFixed(1)))
        ]}</td
      >
    </tr>
    <tr>
      <td colspan="2"
        >{[
          parseInt(((big[0] / 10000) * 100).toFixed(1)) + '%',
          parseInt(((big[1] / 10000) * 100).toFixed(1)) + '%'
        ]}</td
      >
    </tr>
  </table>

  <RangeSlider
    bind:values={zero}
    min={zeromin}
    max={zeromax}
    range
    float
    pips
    all="label"
    step={1}
    pipstep={5}
    {reversed}
    {hoverable}
    {disabled}
  />
  <button
    on:click={() => {
      zeromin = 10;
      zeromax = 30;
      zero = [3, 70];
    }}>increase min/max</button
  >
  - <span class="transform-gpu">{zero}</span>

  <h2>push & pop values</h2>
  <RangeSlider bind:values float pips all="label" {reversed} {hoverable} {disabled} ariaLabels="x" />
  <button on:click={pushValues}>push</button>
  <button on:click={popValues}>pop</button>
  <span class="transform-gpu">({values})</span>

  <h2>Binding to inputs</h2>
  <RangeSlider
    bind:values
    on:start={(e) => {
      console.log('start', e.detail);
    }}
    on:stop={(e) => {
      console.log('end', e.detail);
    }}
    on:change={(e) => {
      console.log('change', e.detail);
    }}
    {reversed}
    {hoverable}
    {disabled}
  />
  {#each values as v}
    <input type="number" bind:value={v} />
  {/each}
  <hr />

  <h2>Decimal / Float Values</h2>
  <RangeSlider
    bind:values={decimals}
    float
    pips
    all="label"
    min={-0.01}
    max={0.01}
    step={0.0005}
    precision={5}
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{decimals}</span>

  <RangeSlider
    bind:values={decimals2}
    float
    pips
    all="label"
    min={-0.11}
    max={0.11}
    step={0.01}
    pipstep={1}
    precision={5}
    {reversed}
    {hoverable}
    {disabled}
  />
  <span class="transform-gpu">{decimals2}</span>

  <h2>Irregular start/end numbers</h2>
  <RangeSlider values={[30, 130]} float pips all="label" hoverable range min={20} max={130} pipstep={3} step={5} />
  <RangeSlider values={[30, 130]} float pips all="label" hoverable range min={30} max={130} pipstep={1} step={1} />

  <h2>Custom HTML labels</h2>
  <RangeSlider
    values={[30, 130]}
    float
    pips
    all="label"
    hoverable
    range
    min={20}
    max={130}
    pipstep={3}
    step={5}
    formatter={(v, i, p) => {
      return `${v} ~ <span style="color: red;">this could be hidden</span>`;
    }}
  />
  <RangeSlider
    values={[30, 130]}
    float
    pips
    all="label"
    hoverable
    range
    min={30}
    max={130}
    pipstep={1}
    step={1}
    handleFormatter={(v, i, p) => {
      return `${v} ~ <span style="color: blue;">this could be hidden</span> ~ ${i} ~ ${p}`;
    }}
  />

  <h2>Aria Labels</h2>
  <p>Inspect the Dom to see the labels</p>
  <RangeSlider ariaLabels="ab" values={[5, 20]} {reversed} {hoverable} {disabled} />
  <RangeSlider ariaLabels={6} {reversed} {hoverable} {disabled} />
  <RangeSlider ariaLabels={{}} {reversed} {hoverable} {disabled} />
  <RangeSlider ariaLabels={['a', 'b']} values={[5, 20]} {reversed} {hoverable} {disabled} />
  <RangeSlider ariaLabels={['a', 'b']} values={[5, 20, 40]} {reversed} {hoverable} {disabled} />
  <RangeSlider ariaLabels={['', 'b']} values={[5, 20]} range {reversed} {hoverable} {disabled} />

  <h2>Store updates</h2>
  <p>Count how many times the store is modified for each change, should be once per single change event.</p>
  <RangeSlider bind:values={$boundStore} pips all="label" max={20} {reversed} {hoverable} {disabled} />
  <RangeSlider bind:values={$boundStore} pips all="label" max={20} {reversed} {hoverable} {disabled} />
  <RangeSlider bind:values={$boundStore} pips all="label" max={20} {reversed} {hoverable} {disabled} />
  Number of store updates: {store_updates}

  <h2>Object Values</h2>
  <RangeSlider bind:value={objectValueBind.value} pips all="label" {reversed} {hoverable} {disabled} />
  <span class="transform-gpu">{objectValueBind.value}</span>
  <RangeSlider bind:values={objectValuesBind.values} pips all="label" {reversed} {hoverable} {disabled} />
  <span class="transform-gpu">{objectValuesBind.values}</span>

  <h2>Value(s) Errors</h2>
  <RangeSlider bind:value={errorValueBind} pips all="label" {reversed} {hoverable} {disabled} />
  <RangeSlider bind:values={errorValuesBind} pips all="label" {reversed} {hoverable} {disabled} />
  <span class="transform-gpu">{errorValueBind} / {errorValuesBind}</span>

  <RangeSlider bind:values={errorValuesObjectBind} pips all="label" {reversed} {hoverable} {disabled} />
  <RangeSlider bind:values={errorValuesStringBind} pips all="label" {reversed} {hoverable} {disabled} />
  <RangeSlider bind:values={errorValuesBooleanBind} pips all="label" {reversed} {hoverable} {disabled} />
  values error;
  <span class="transform-gpu">{errorValuesObjectBind} / {errorValuesStringBind} / {errorValuesBooleanBind}</span>

  <RangeSlider bind:value={errorValueObjectBind} pips all="label" {reversed} {hoverable} {disabled} />
  <RangeSlider bind:value={errorValueStringBind} pips all="label" {reversed} {hoverable} {disabled} />
  <RangeSlider bind:value={errorValueBooleanBind} pips all="label" {reversed} {hoverable} {disabled} />
  value error;
  <span class="transform-gpu">{errorValueObjectBind} / {errorValueStringBind} / {errorValueBooleanBind}</span>

  <h2>Value as Input</h2>
  <RangeSlider bind:value={valueBind} pips all="label" {reversed} {hoverable} {disabled} />
  <span class="transform-gpu">{valueBind}</span>
  <div style="display: flex; gap: 1em;">
    <button
      on:click={() => {
        valueBind = Math.random() * 100;
      }}>Random Valid Value</button
    >
    <button
      on:click={() => {
        valueBind = [99];
      }}>Invalid Array Value [99]</button
    >
    <button
      on:click={() => {
        valueBind = '69';
      }}>Invalid String Value '69'</button
    >
  </div>
</div>
