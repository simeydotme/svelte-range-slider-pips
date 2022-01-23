<script>

  import { onMount } from "svelte";
  import RangeSlider from "../../src/RangeSlider.svelte";

  let reversed = false;
  let disabled = false;
  let hoverable = true;

  let values = [21.3, 40, 60, 80];
  let dynamic = [0,50];
  let pushy = [30,60];
  let vrange = [20,80];

  const num = new Intl.NumberFormat("en-US");
  const numzh = new Intl.NumberFormat("zh-Hans-CN-u-nu-hanidec");
  const formatter = v => { return num.format(v); };

  let day = [3];
  const days = [ "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Happy Days" ];
  const dayFormat = v => days[v];
  const dayFormatCn = v => { if (v === 6) { return "星期日"; }; return "星期" + numzh.format(v + 1); };
  
  let perc1 = [5];
	let perc2 = [100 - perc1];
  $: perc2max = 100 - perc1[0];

  let big = [500,1000];
  let hramp = ( v,i,p ) => { return ((v) * (((p/100)*(p/100)) )).toFixed(0) + " (" + p + "%)"; };
  let ramp = ( v,i,p ) => { return ((v) * (((p/100)*(p/100)) )).toFixed(0); };

  let hue = [244];
  $: lightColor = `hsl(${Math.round(hue[0]) - 10}, 65%, 70%)`;
  $: color = `hsl(${Math.round(hue[0])}, 63%, 54%)`;

  let zero = [2,10];
  let zeromin = 0;
  let zeromax = 0;

  let arrayPush = [11,99];
  let pushValues = () => {
    values.push(Math.random()*100);
    values = values
  }
  let popValues = () => {
    values.pop();
    values = values
  }

  let boundSlider;
  onMount(() => {
    console.log( boundSlider );
    setTimeout(() => {
      boundSlider.scrollIntoView({ behavior: "smooth", block: "center" });
      boundSlider.style.outline = "1px dotted black";
      boundSlider.style.outlineOffset = "15px";
    },500);
  });
  
</script>

<svelte:head>
<style>
  #test-id {
    --range-slider: #9dceff;
    --range-handle: rgb(245, 200, 230);
    --range-handle-inactive: rgb(245, 200, 230);
    --range-handle-focus: rgb(245, 0, 46);
  }
  #test-id [data-handle="1"] {
    --handle: #a0ffe0;
    --handle-inactive:  var(--handle);
    --handle-border:  var(--handle);
    --handle-focus: turquoise;
  }
  #test-id [data-handle="2"] {
    --handle: #fdcebd;
    --handle-inactive:  var(--handle);
    --handle-border:  var(--handle);
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
</style>
</svelte:head>

<header>

  <button on:click={()=>{hoverable=!hoverable}}>hoverable <input type='checkbox' checked="{hoverable}" /></button>
  <button on:click={()=>{disabled=!disabled}}>disabled <input type='checkbox' checked="{disabled}" /></button>
  <button on:click={()=>{reversed=!reversed}}>reverse sliders <input type='checkbox' checked="{reversed}" /></button>

</header>

<main>
	
  <div class="content" style="--range-handle-focus: {color}; --range-handle: {lightColor}">

    
    <section style="display: flex; justify-content: space-evenly;">
      <RangeSlider vertical pips all="label" {reversed} {hoverable} {disabled} />
      <div>
        <RangeSlider bind:values={vrange} vertical pips all="label" float {reversed} {hoverable} {disabled} />
        <RangeSlider bind:values={vrange} vertical range pips all="label" float {reversed} {hoverable} {disabled} />
        <br>
        {vrange}
      </div>
      <RangeSlider vertical range="min" values={[10]} pips all float {reversed} {hoverable} {disabled} />
      <RangeSlider vertical range="max" values={[30]} pips float {reversed} {hoverable} {disabled} />
    </section>

    
    <br>
    <h2>Spring & Colors Test</h2>
    <br>
    springValues = stiffness: .05, damping: 0.05 
    <RangeSlider id="test-id" springValues={{ stiffness: .05, damping: 0.05 }} bind:values {reversed} {hoverable} {disabled} />
    <RangeSlider id="test-id" springValues={{ stiffness: .1, damping: .857 }} bind:values {reversed} {hoverable} {disabled} />
    springValues = stiffness: .1, damping: .85 
    
    <br>
    
    <h2>Default with float</h2>
    <RangeSlider float {reversed} {hoverable} {disabled} />
    <RangeSlider float {reversed} {hoverable} {disabled} bind:slider="{boundSlider}" />

    <h2>Pips & Floats</h2>
    <RangeSlider float pips all="label" {reversed} {hoverable} {disabled} />
    <RangeSlider float pips first="label" last="label" {reversed} {hoverable} {disabled} />
    <h2>trim/align</h2>
    <RangeSlider values="{[-10,12,103]}" float pips step={5} all="label" {reversed} {hoverable} {disabled} />
    <h2>events</h2>
    <RangeSlider float pips first="label" last="label" rest="label"
      on:start={(e) => { console.log("start",e.detail)}}
      on:stop={(e) => { console.log("stop",e.detail)}} 
      on:change={(e) => { console.log("change",e.detail)}} 
   {reversed} {hoverable} {disabled} />
    <br>
    <h2>range</h2>
    <h3>Handles block each other</h3>
    <RangeSlider range bind:values={pushy} float {reversed} {hoverable} {disabled} />
    <h3>Handles push each other</h3>
    <RangeSlider range pushy bind:values={pushy} pips all="label" float {reversed} {hoverable} {disabled} />
    <h2>min range</h2>
    <RangeSlider range="min" values={[65]} pips all="label" float {reversed} {hoverable} {disabled} />
    <h2>max range</h2>
    <RangeSlider range="max" values={[35]} pips all="label" float {reversed} {hoverable} {disabled} />
    <br>
    <RangeSlider float pips step={10} pipstep={1} {reversed} {hoverable} {disabled} />
    <RangeSlider float pips step={10} pipstep={2} {reversed} {hoverable} {disabled} />
    <RangeSlider float pips step={0.1} min={dynamic[0]} max={dynamic[1]} 
      on:start={(e) => { console.log("start",e.detail)}}
      on:stop={(e) => { console.log("stop",e.detail)}} 
      on:change={(e) => { console.log("change",e.detail)}} 
   {reversed} {hoverable} {disabled} />
    <br>
    <RangeSlider float pips first="label" last="label" rest pipstep={1} bind:values={dynamic} range {reversed} {hoverable} {disabled} />

    <h2>Prefix</h2>
    <RangeSlider prefix="$" range values={[20,80]} float pips first="label" last="label" {reversed} {hoverable} {disabled} />
    <h2>Prefix & Suffix, color</h2>
    <RangeSlider id="clr-test" prefix="~" suffix="m²" {formatter} range values={[100,3000]} min={100} max={3000} step={200} float pips all="label" {reversed} {hoverable} {disabled} />
    <h2>Formatters</h2>
    <RangeSlider handleFormatter={(v,i)=>`${v}% O²`} formatter={(v,i)=>`${v}% O²`} step={1} float pips first="label" last="label" hover={false} values={[25,50,75]} {reversed} {hoverable} {disabled} />
    <RangeSlider handleFormatter={(v,i)=>`v: ${v}, i: ${i}`} formatter={(v,i)=>`v: ${v}, i: ${i}`} step={10} float pips all="label" values={[25,50,75]} {reversed} {hoverable} {disabled} />
    <br>
    <RangeSlider bind:values={day} min={0} max={6} formatter={dayFormat} float pips first="label" last="label" rest="label" {reversed} {hoverable} {disabled} />
    <RangeSlider bind:values={day} min={0} max={6} formatter={dayFormatCn} float pips first="label" last="label" rest="label" {reversed} {hoverable} {disabled} />
    <br>
    <br>{dayFormatCn(day[0])} | {dayFormat(day[0])}<br>
    <br>
    <RangeSlider bind:values={hue} max={360} range="min" float formatter={(v)=>color} {reversed} {hoverable} {disabled} />


    <RangeSlider bind:values={perc1} min={0} max={50} pips all="label" float {reversed} {hoverable} {disabled} />
    <RangeSlider bind:values={perc2} min={0} max={perc2max} pips all="label" float {reversed} {hoverable} {disabled} /> 
    <hr> {perc1} / {perc2} 

    <br>
    
    <h2>BIG, ramped value</h2>
    <RangeSlider bind:values={big} min={0} max={10000} pips first="label" last="label" float formatter={ramp} handleFormatter={hramp} {reversed} {hoverable} {disabled} />
    <table>
      <tr>
        <th>real value</th><th>formatted (ramp(v,i,p))</th>
      </tr>
      <tr>
        <td>{big}</td><td>{[ ramp(big[0],0,parseFloat((big[0] / 10000 * 100).toFixed(1))), ramp(big[1],0,parseFloat((big[1] / 10000 * 100).toFixed(1))) ]}</td>
      </tr>
      <tr>
        <td colspan=2>{[ parseInt((big[0] / 10000 * 100).toFixed(1)) + "%", parseInt((big[1] / 10000 * 100).toFixed(1)) + "%" ]}</td>
      </tr>
    </table>
    
    <br>

    <RangeSlider bind:values={zero} min={zeromin} max={zeromax} range float pips all="label" step={1} pipstep={5} {reversed} {hoverable} {disabled} />
    <br><button on:click={()=>{ zeromin = 10; zeromax = 30; zero = [3,70]; }}>increase min/max</button> - {zero} 
    
    <h2>push & pop values</h2>
    <RangeSlider bind:values float pips all="label" {reversed} {hoverable} {disabled} />
    <button on:click={pushValues}>push</button>
    <button on:click={popValues}>pop</button>
    <br>({values})
    
    <h2>Binding to inputs</h2>
    <RangeSlider bind:values  
      on:start={(e) => { console.log("start",e.detail)}}
      on:stop={(e) => { console.log("end",e.detail)}} 
      on:change={(e) => { console.log("change",e.detail)}} 
   {reversed} {hoverable} {disabled} />
    {#each values as v}
      <input type="number" bind:value={v} />
    {/each}
    <hr>

  </div>


</main>
