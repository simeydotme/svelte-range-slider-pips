<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [25,75];
  let slider: HTMLDivElement;
  let float = true;

  $: if ( slider ) { 
    slider.classList.add( "rsFocus" );
    slider.querySelectorAll('.rangeHandle').forEach((el) => { el.classList.add( "rsActive" ) });
  };
</script>

<div class="float-container">
  <input id="float-checkbox" type="checkbox" bind:checked={float} />
  <label for="float-checkbox">Float</label>
</div>

<RangeSlider {float} bind:values bind:slider />

<code data-values title="The output slider values">{values}</code>
