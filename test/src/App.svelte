<script>

  import RangeSlider from "../../src/RangeSlider.svelte";

  let values = [21.3, 40, 60, 80];
  let dynamic = [0,50];
  let pushy = [30,60]

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

  let hue = [244];
  $: lightColor = `hsl(${Math.round(hue[0]) - 10}, 65%, 70%)`;
  $: color = `hsl(${Math.round(hue[0])}, 63%, 54%)`;

  let zero = [2,10];
  let zeromin = 0;
  let zeromax = 0;

  let disabled = false;

  let arrayPush = [11,99];
  let pushValues = () => {
    values.push(Math.random()*100);
    values = values
  }
  let popValues = () => {
    values.pop();
    values = values
  }
  
</script>

<svelte:head>
<style>
  #test-id {
    --range-slider: rgb(245, 200, 230);
    --range-handle: var(--range-slider);
    --range-handle-inactive: var(--range-slider);
    --range-handle-focus: rgb(245, 0, 46);
  }
  #test-id [data-handle="1"] {
    --handle: turquoise;
    --handle-inactive: #a0ffe0;
    --handle-border: #a0ffe0;
    --handle-focus: var(--handle);
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

<main>
	
  <div class="content" style="--range-handle-focus: {color}; --range-handle: {lightColor}">

    <RangeSlider vertical range values={[10,30]} pips all="label" />
    <RangeSlider vertical range="min" values={[10]} pips all />
    <RangeSlider vertical range="max" values={[30]} pips />
    
    <br>
    <h2>Spring & Colors Test</h2>
    <RangeSlider id="test-id" springValues={{ stiffness: 0.03, damping: 0.08 }} bind:values />
    <br>
    
    
    <RangeSlider float />
    <RangeSlider float pips all="label" />
    <RangeSlider float pips first="label" last="label" {disabled} />
    <h2>trim/align</h2>
    <RangeSlider values="{[-10,12,103]}" float pips step={5} all="label" {disabled} />
    <h2>events</h2>
    <RangeSlider float pips first="label" last="label" rest="label"
      on:start={(e) => { console.log("start",e.detail)}}
      on:stop={(e) => { console.log("stop",e.detail)}} 
      on:change={(e) => { console.log("change",e.detail)}} 
    />
    <br>
    <h2>range</h2>
    <h3>Handles block each other</h3>
    <RangeSlider range bind:values={pushy} float />
    <h3>Handles push each other</h3>
    <RangeSlider range pushy bind:values={pushy} pips all="label" float />
    <h2>min range</h2>
    <RangeSlider range="min" values={[65]} pips all="label" float />
    <h2>max range</h2>
    <RangeSlider range="max" values={[35]} pips all="label" float />
    <br>
    <RangeSlider float pips step={10} pipstep={1} />
    <RangeSlider float pips step={10} pipstep={2} />
    <RangeSlider float pips step={0.1} min={dynamic[0]} max={dynamic[1]} 
      on:start={(e) => { console.log("start",e.detail)}}
      on:stop={(e) => { console.log("stop",e.detail)}} 
      on:change={(e) => { console.log("change",e.detail)}} 
    />
    <br>
    <RangeSlider float pips first="label" last="label" rest pipstep={1} bind:values={dynamic} range />

    <h2>Prefix</h2>
    <RangeSlider prefix="$" range values={[20,80]} float pips first="label" last="label" />
    <h2>Prefix & Suffix, color</h2>
    <RangeSlider id="clr-test" prefix="~" suffix="m²" {formatter} range values={[100,3000]} min={100} max={3000} step={200} float pips all="label" />
    <h2>Formatters</h2>
    <RangeSlider handleFormatter={(v,i)=>"O²"} formatter={(v,i)=>`${v}% O²`} step={1} float pips first="label" last="label" hover={false} values={[25,50,75]} />
    <RangeSlider handleFormatter={(v,i)=>`v: ${v}, i: ${i}`} formatter={(v,i)=>`v: ${v}, i: ${i}`} step={10} float pips all="label" values={[25,50,75]} />
    <br>
    <RangeSlider bind:values={day} min={0} max={6} formatter={dayFormat} float pips first="label" last="label" rest="label" />
    <RangeSlider bind:values={day} min={0} max={6} formatter={dayFormatCn} float pips first="label" last="label" rest="label" />
    <br>
    <br>{dayFormatCn(day[0])} | {dayFormat(day[0])}<br>
    <br>
    <RangeSlider bind:values={hue} max={360} range="min" float formatter={(v)=>color} />


    <RangeSlider bind:values={perc1} min={0} max={50} pips all="label" float />
    <RangeSlider bind:values={perc2} min={0} max={perc2max} pips all="label" float /> 
    <hr>
    percent1: {perc1}<br>percent2: {perc2} 

    <br><br>

    <RangeSlider bind:values={zero} min={zeromin} max={zeromax} range float pips all="label" step={1} pipstep={5} />
    <br><button on:click={()=>{ zeromin = 10; zeromax = 30; zero = [3,70]; }}>increase min/max</button> - {zero} 
    
    <h2>disable / enable</h2>
    <RangeSlider bind:values float pips all="label" {disabled} />
    <button on:click={()=>{disabled=!disabled}}>toggle disabled</button>

    <h2>push & pop values</h2>
    <RangeSlider bind:values float pips all="label" />
    <button on:click={pushValues}>push</button>
    <button on:click={popValues}>pop</button>
    <br>({values})
    
    <h2>Binding to inputs</h2>
    <RangeSlider bind:values {disabled} 
      on:start={(e) => { console.log("start",e.detail)}}
      on:stop={(e) => { console.log("end",e.detail)}} 
      on:change={(e) => { console.log("change",e.detail)}} 
    />
    {#each values as v}
      <input type="number" bind:value={v} {disabled} />
    {/each}
    <hr>

  </div>


</main>
