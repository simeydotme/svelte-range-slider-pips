<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [25,75];
  let slider: HTMLDivElement;
  let float = true;
  let rangeFloat = true;

  $: if ( slider ) { 
    slider.classList.add( "rsFocus" );
    slider.querySelectorAll('.rangeHandle').forEach((el) => { el.classList.add( "rsActive" ) });
  };
</script>

<div class="float-container">
  <div>
  <input id="float-checkbox-2" type="checkbox" bind:checked={float} />
  <label for="float-checkbox-2">float</label>
  </div>
  <div>
    <input id="range-checkbox-2" type="checkbox" bind:checked={rangeFloat} />
    <label for="range-checkbox-2">rangeFloat</label>
  </div>
</div>

<RangeSlider {float} {rangeFloat} range bind:values bind:slider />

<code data-values title="The output slider values">{values}</code>


<style>
  .float-container {
    display: flex;
    gap: 2rem;
    justify-content: center;
  }
</style>