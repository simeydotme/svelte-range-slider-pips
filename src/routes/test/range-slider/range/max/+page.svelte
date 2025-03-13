<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <RangeSlider id="single-handle-max" range="max" value={70} />
  <RangeSlider id="double-handle-max" range="max" values={[20, 60]} />
  <RangeSlider id="triple-handle-max" range="max" values={[20, 50, 90]} max={80} />
</div>
