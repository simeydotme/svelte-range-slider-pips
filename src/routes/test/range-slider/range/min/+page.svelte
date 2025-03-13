<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <RangeSlider id="single-handle-min" range="min" value={30} />
  <RangeSlider id="double-handle-min" range="min" values={[20, 60]} />
  <RangeSlider id="triple-handle-min" range="min" values={[40, 60, 70]} min={20} />
</div>
