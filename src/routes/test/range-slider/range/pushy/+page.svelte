<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';

  let values = [40, 60];
  let pushyValues = [40, 60];
  let pushyToggle = false;

  // Decimal steps configuration
  let decimalValues = [40, 60];
  let decimalStep = 0.1;

  // Vertical orientation configuration
  let verticalValues = [40, 60];

  // Negative values configuration
  let negativeValues = [-20, 0];

  // Edge cases configuration
  let edgeValues = [40, 60];
</script>

<div class="slider-list">
  <h5>Basic range slider with pushy disabled</h5>
  <RangeSlider id="not-pushy" range {values} pushy={false} />

  <h5>Range slider with pushy enabled</h5>
  <RangeSlider id="pushy" range values={pushyValues} pushy={true} />

  <div class="toggle-container slider-list">
    <h5>Range slider with toggleable pushy behavior ({pushyToggle ? 'true' : 'false'})</h5>
    <RangeSlider id="pushy-toggle" range values={pushyValues} pushy={pushyToggle} />
    <button class:btn-primary={pushyToggle} on:click={() => (pushyToggle = !pushyToggle)}
      >Toggle Pushy ({pushyToggle ? 'true' : 'false'})</button
    >
  </div>

  <h5>Range slider with decimal steps (step=0.1)</h5>
  <RangeSlider id="decimal-steps" range values={decimalValues} pushy={true} step={decimalStep} />

  <h5>Range slider in vertical orientation</h5>
  <RangeSlider id="vertical-pushy" range values={verticalValues} pushy={true} vertical={true} />

  <h5>Range slider with negative values</h5>
  <RangeSlider id="negative-values" range values={negativeValues} pushy={true} min={-100} max={0} />

  <h5>Range slider for edge cases</h5>
  <RangeSlider id="edge-cases" range values={edgeValues} pushy={true} />
</div>
