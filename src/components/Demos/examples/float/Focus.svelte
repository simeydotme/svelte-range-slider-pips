<script>
  import RangeSlider from 'svelte-range-slider-pips';

  let slider;

  $: if ( slider ) {
    slider.querySelector('.rangeHandle').focus();
  }
</script>

<RangeSlider bind:slider float />

