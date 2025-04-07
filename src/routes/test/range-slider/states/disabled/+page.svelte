<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let value = 50;
  let values = [25, 75];
</script>

<div class="slider-list">
  <h5>Disabled Single Slider</h5>
  <RangeSlider
    id="disabled-single-slider"
    bind:value
    disabled={true}
    min={0}
    max={100}
    step={1}
    pips={true}
    all="label"
  />

  <h5>Disabled Range Slider</h5>
  <RangeSlider
    id="disabled-range-slider"
    bind:values
    range={true}
    disabled={true}
    min={0}
    max={100}
    step={1}
    pips={true}
    all="label"
  />

  <h5>Dynamic Disabled State</h5>
  <RangeSlider
    id="dynamic-disabled-slider"
    bind:value
    disabled={value >= 75}
    min={0}
    max={100}
    step={1}
    pips={true}
    all="label"
  />
</div>
