<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let value = 50;
  let values = [25, 75];
  let isHoverable = true;
</script>

<div class="slider-list">
  <h5>Non-Hoverable Single Slider</h5>
  <RangeSlider
    id="non-hoverable-single-slider"
    bind:value
    hoverable={false}
    min={0}
    max={100}
    step={1}
    pips={true}
    all="label"
    float
  />

  <h5>Non-Hoverable Range Slider</h5>
  <RangeSlider
    id="non-hoverable-range-slider"
    bind:values
    range={true}
    hoverable={false}
    min={0}
    max={100}
    step={1}
    pips={true}
    all="label"
    float
  />

  <h5>Dynamic Hoverable State</h5>
  <button 
    id="toggle-hoverable-btn"
    on:click={() => isHoverable = !isHoverable} 
    class:btn-primary={isHoverable}
  >
    Toggle Hoverable ({isHoverable ? 'On' : 'Off'})
  </button>
  <RangeSlider
    id="dynamic-hoverable-slider"
    bind:value
    hoverable={isHoverable}
    min={0}
    max={100}
    step={1}
    pips={true}
    all="label"
    float
  />
</div>