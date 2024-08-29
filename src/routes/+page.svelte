<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import RangeSlider from '$lib/components/RangeSlider.svelte';
  import './barebones.css';
  import type { Formatter } from '$lib/types.js';

  let reversed = false;
  let disabled = false;
  let hoverable = true;

  let values = [21.3, 40, 60, 80];
  let dynamic = [0, 50];
  let pushy = [30, 60];
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
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@300,400,600&display=swap"
    rel="stylesheet"
  />
  <style>
    #test-id {
      --range-slider: #9dceff;
      --range-handle: rgb(245, 200, 230);
      --range-handle-inactive: rgb(245, 200, 230);
      --range-handle-focus: rgb(245, 0, 46);
    }
    #test-id [data-handle='1'] {
      --handle: #a0ffe0;
      --handle-inactive: var(--handle);
      --handle-border: var(--handle);
      --handle-focus: turquoise;
    }
    #test-id [data-handle='2'] {
      --handle: #fdcebd;
      --handle-inactive: var(--handle);
      --handle-border: var(--handle);
      --handle-focus: coral;
    }
    #clr-test {
      --range-slider: rgb(195, 228, 222);
      --range-handle-inactive: rgb(81, 185, 180);
      --range-handle: rgb(81, 185, 180);
      --range-handle-focus: rgb(35, 241, 214);
      --range-float-text: darkcyan;
      --pip: #eee;
      --pip-text: #aaa;
      --pip-active: black;
      --pip-active-text: darkcyan;
    }
    table {
      width: 100%;
    }
    header {
      position: sticky;
      top: 0;
      padding: 20px;
      background: white;
      z-index: 100;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    h1,
    h2,
    h3,
    h4 {
      margin-top: 2em;
      font-weight: 400;
    }
    main {
      display: flex;
      justify-content: center;
      max-width: calc(100% - 40px);
      width: 1024px;
      margin: 100px auto;
    }
  </style>
</svelte:head>

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

<main>
  <div class="content" style="--range-handle-focus: {color}; --range-handle: {lightColor}">
    <h4>Vertical Tests</h4>

    <section style="display: flex; justify-content: space-evenly;">
      <RangeSlider vertical pips all="label" {reversed} {hoverable} {disabled} />
      <div>
        <RangeSlider
          bind:values={vrange}
          vertical
          pips
          all="label"
          float
          {reversed}
          {hoverable}
          {disabled}
        />
        <RangeSlider
          bind:values={vrange}
          vertical
          range
          pips
          all="label"
          float
          {reversed}
          {hoverable}
          {disabled}
        />

        {vrange}
      </div>
      <RangeSlider
        vertical
        range="min"
        values={[10]}
        pips
        all
        float
        {reversed}
        {hoverable}
        {disabled}
      />
      <RangeSlider
        vertical
        range="max"
        values={[30]}
        pips
        float
        {reversed}
        {hoverable}
        {disabled}
      />
    </section>

    <h4>Spring & Colors Test</h4>

    <table>
      <tr>
        <th width="50">stiffness</th>
        <th width="50">damping</th>
        <th>result</th>
      </tr>
      <tr>
        <td><code>0.75</code></td>
        <td><code>0.1</code></td>
        <td
          ><RangeSlider
            id="test-id3"
            springValues={{ stiffness: 0.75, damping: 1 }}
            bind:values
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
            bind:values
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
            bind:values
            {reversed}
            {hoverable}
            {disabled}
          /></td
        >
      </tr>
    </table>

    <h4>Default with float</h4>
    <RangeSlider float {reversed} {hoverable} {disabled} />
    <RangeSlider float {reversed} {hoverable} {disabled} bind:slider={boundSlider} />

    <h4>Pips & Floats</h4>
    <RangeSlider float pips all="label" {reversed} {hoverable} {disabled} />
    <RangeSlider float pips first="label" last="label" {reversed} {hoverable} {disabled} />
    <h4>trim/align</h4>
    <RangeSlider
      values={[-10, 12, 103]}
      float
      pips
      step={5}
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    <h4>events</h4>
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

    <h4>range</h4>
    <h5>Handles block each other</h5>
    <RangeSlider range bind:values={pushy} float {reversed} {hoverable} {disabled} />
    <h5>Handles push each other</h5>
    <RangeSlider
      range
      pushy
      bind:values={pushy}
      pips
      all="label"
      float
      {reversed}
      {hoverable}
      {disabled}
    />
    <h4>min range</h4>
    <RangeSlider
      range="min"
      values={[65]}
      pips
      all="label"
      float
      {reversed}
      {hoverable}
      {disabled}
    />
    <h4>max range</h4>
    <RangeSlider
      range="max"
      values={[35]}
      pips
      all="label"
      float
      {reversed}
      {hoverable}
      {disabled}
    />

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

    <h4>Prefix</h4>
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
    <h4>Prefix & Suffix, color</h4>
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
    <h4>Formatters</h4>
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

    {dayFormatCn(day[0])} | {dayFormat(day[0])}

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

    <RangeSlider
      bind:values={perc1}
      min={0}
      max={50}
      pips
      all="label"
      float
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:values={perc2}
      min={0}
      max={perc2max}
      pips
      all="label"
      float
      {reversed}
      {hoverable}
      {disabled}
    />
    <hr />
    {perc1} / {perc2}

    <h4>BIG, ramped value</h4>
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
        <td>{big}</td><td
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
    - {zero}

    <h4>push & pop values</h4>
    <RangeSlider
      bind:values
      float
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
      ariaLabels="x"
    />
    <button on:click={pushValues}>push</button>
    <button on:click={popValues}>pop</button>
    ({values})

    <h4>Binding to inputs</h4>
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

    <h4>Decimal / Float Values</h4>
    <RangeSlider
      bind:values={decimals}
      float
      pips
      all="label"
      min={-0.01}
      max={0.01}
      step={0.0005}
      precision={3}
      {reversed}
      {hoverable}
      {disabled}
    />
    {decimals}

    <RangeSlider
      bind:values={decimals2}
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
    {decimals2}

    <h4>Irregular start/end numbers</h4>
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
    />

    <h4>Custom HTML labels</h4>
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

    <h4>Aria Labels</h4>
    <p>Inspect the Dom to see the labels</p>
    <RangeSlider ariaLabels="ab" values={[5, 20]} {reversed} {hoverable} {disabled} />
    <RangeSlider ariaLabels={6} {reversed} {hoverable} {disabled} />
    <RangeSlider ariaLabels={{}} {reversed} {hoverable} {disabled} />
    <RangeSlider ariaLabels={['a', 'b']} values={[5, 20]} {reversed} {hoverable} {disabled} />
    <RangeSlider ariaLabels={['a', 'b']} values={[5, 20, 40]} {reversed} {hoverable} {disabled} />
    <RangeSlider ariaLabels={['', 'b']} values={[5, 20]} range {reversed} {hoverable} {disabled} />

    <h4>Store updates</h4>
    <p>
      Count how many times the store is modified for each change, should be once per single change
      event.
    </p>
    <RangeSlider
      bind:values={$boundStore}
      pips
      all="label"
      max={20}
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:values={$boundStore}
      pips
      all="label"
      max={20}
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:values={$boundStore}
      pips
      all="label"
      max={20}
      {reversed}
      {hoverable}
      {disabled}
    />
    Number of store updates: {store_updates}

    <h4>Object Values</h4>
    <RangeSlider
      bind:value={objectValueBind.value}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    {objectValueBind.value}
    <RangeSlider
      bind:values={objectValuesBind.values}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    {objectValuesBind.values}

    <h4>Value(s) Errors</h4>
    <RangeSlider bind:value={errorValueBind} pips all="label" {reversed} {hoverable} {disabled} />
    <RangeSlider bind:values={errorValuesBind} pips all="label" {reversed} {hoverable} {disabled} />
    {errorValueBind} / {errorValuesBind}

    <RangeSlider
      bind:values={errorValuesObjectBind}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:values={errorValuesStringBind}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:values={errorValuesBooleanBind}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    values error; {errorValuesObjectBind} / {errorValuesStringBind} / {errorValuesBooleanBind}

    <RangeSlider
      bind:value={errorValueObjectBind}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:value={errorValueStringBind}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    <RangeSlider
      bind:value={errorValueBooleanBind}
      pips
      all="label"
      {reversed}
      {hoverable}
      {disabled}
    />
    value error; {errorValueObjectBind} / {errorValueStringBind} / {errorValueBooleanBind}

    <h4>Value as Input</h4>
    <RangeSlider bind:value={valueBind} pips all="label" {reversed} {hoverable} {disabled} />
    {valueBind}
    <button
      on:click={() => {
        valueBind = Math.random() * 100;
      }}>Random Value</button
    >
    <button
      on:click={() => {
        valueBind = [99];
      }}>Array Value</button
    >
    <button
      on:click={() => {
        valueBind = '69';
      }}>Invalid Value</button
    >
  </div>
</main>
