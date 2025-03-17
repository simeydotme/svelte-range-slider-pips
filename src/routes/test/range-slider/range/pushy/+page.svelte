<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  let values = [40, 60];
  let pushyValues = [40, 60];
  let pushyToggle = false;
</script>

<div class="slider-list">
  <h5>Basic range slider with pushy disabled</h5>
  <RangeSlider id="not-pushy" range {values} pushy={false} />

  <h5>Range slider with pushy enabled</h5>
  <RangeSlider id="pushy" range values={pushyValues} pushy={true} />

  <div class="toggle-container slider-list">
    <h5>Range slider with toggleable pushy behavior ({pushyToggle ? 'true' : 'false'})</h5>
    <RangeSlider id="pushy-toggle" range values={pushyValues} pushy={pushyToggle} />
    <button on:click={() => (pushyToggle = !pushyToggle)}>Toggle Pushy</button>
  </div>
</div>
