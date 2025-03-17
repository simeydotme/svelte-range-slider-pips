<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  let values = [40, 60];
  let draggyValues = [40, 60];
  let draggyToggle = false;
</script>

<div class="slider-list">
  <RangeSlider id="not-draggy" range {values} draggy={false} />
  <RangeSlider id="draggy" range values={draggyValues} draggy={true} />
  <RangeSlider id="draggy-gaps" range values={draggyValues} draggy={true} rangeGapMin={10} rangeGapMax={10} pushy />
  <div class="toggle-container slider-list">
    <h3>draggy Toggle: {draggyToggle ? 'true' : 'false'}</h3>
    <RangeSlider id="draggy-toggle" range values={draggyValues} draggy={draggyToggle} />
    <button on:click={() => (draggyToggle = !draggyToggle)}>Toggle draggy</button>
  </div>
</div>
