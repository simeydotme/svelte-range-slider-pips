<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  let values = [40, 60];
  let draggyValues = [40, 60];
  let draggyToggle = false;
</script>

<div class="slider-list">
  <h5>Basic range slider with draggy disabled</h5>
  <RangeSlider id="not-draggy" range {values} draggy={false} />

  <h5>Range slider with draggy enabled</h5>
  <RangeSlider id="draggy" range values={draggyValues} draggy={true} />

  <h5>Range slider with fixed 10% gap and pushy behavior</h5>
  <RangeSlider id="draggy-gaps" range values={draggyValues} draggy={true} rangeGapMin={10} pushy />

  <div class="toggle-container slider-list">
    <h5>Range slider with toggleable draggy behavior ({draggyToggle ? 'true' : 'false'})</h5>
    <RangeSlider id="draggy-toggle" range values={draggyValues} draggy={draggyToggle} />
    <button on:click={() => (draggyToggle = !draggyToggle)}>Toggle draggy</button>
  </div>
</div>
