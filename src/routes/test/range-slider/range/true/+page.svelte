<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h3>Single handles</h3>
  <RangeSlider id="single-handle-true" range={true} values={[40]} />
  <RangeSlider id="single-handle-true-value" range={true} value={40} />

  <h3>Double handles</h3>
  <RangeSlider id="double-handle-true" range={true} values={[25, 75]} />
  <RangeSlider
    id="double-handle-true-negative"
    range={true}
    values={[-75, 25]}
    min={-100}
    max={100}
  />
  <RangeSlider
    id="double-handle-true-constrained"
    range={true}
    values={[-130, 125]}
    min={-100}
    max={100}
  />

  <h3>Triple handles</h3>
  <RangeSlider id="triple-handle-true" range={true} values={[15, 45, 75]} />
  <RangeSlider id="triple-handle-true-negative" range={true} values={[-75, 45, 15]} min={-50} />
</div>
