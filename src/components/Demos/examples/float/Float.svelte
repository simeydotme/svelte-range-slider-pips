<script lang="ts">
  import RangeSlider from 'svelte-range-slider-pips';
  let values = [25,75];
  let slider: HTMLDivElement;

  $: if ( slider ) { 
    slider.classList.add( "focus" );
    slider.querySelectorAll('.rangeHandle').forEach((el) => { el.classList.add( "active" ) });
  };
</script>

<RangeSlider float range bind:values bind:slider={slider} />

<code data-values title="The output slider values">{values}</code>
