<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  let values = [40, 60];
  let pushyValues = [40, 60];
  let pushyToggle = false;
</script>

<div class="slider-list">
  <RangeSlider id="not-pushy" range {values} pushy={false} />
  <RangeSlider id="pushy" range values={pushyValues} pushy={true} />
  <div class="toggle-container slider-list">
    <h3>Pushy Toggle: {pushyToggle ? 'true' : 'false'}</h3>
    <RangeSlider id="pushy-toggle" range values={pushyValues} pushy={pushyToggle} />
    <button on:click={() => (pushyToggle = !pushyToggle)}>Toggle Pushy</button>
  </div>
</div>
