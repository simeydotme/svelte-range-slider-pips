<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';

  let size = [16];

  $: sizeStyle = 
`<style>
  #sizeExample .rangeSlider {
    font-size: ${size[0]}px;
  }
</style>`

</script>


<div class="variables" id="sizeExample" >

  <RangeSlider min={8} max={32} bind:values={size} step={0.5} pipstep={12} pips all="label" float suffix="px" />

  {@html sizeStyle}

  <pre class="output-css"><code
    >{ sizeStyle.replace(/\s\*{}/,"") }</code
  ></pre>

</div>

<style>

  .output-css {
    margin-block: 2rem 0;
    text-align: left;
    overflow-x: auto;
    box-sizing: border-box;
    max-width: 100%;
  }
  .output-css code {
    all: unset;
  }

  #sizeExample :global(.rangeSlider) {
    margin: 1em 1em 4em;
  }


</style>