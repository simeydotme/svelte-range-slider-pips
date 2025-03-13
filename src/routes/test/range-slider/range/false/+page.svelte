<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <RangeSlider id="single-handle-false" range={false} values={[60]} />
  <RangeSlider id="double-handle-false" range={false} values={[35, 85]} />
  <RangeSlider id="triple-handle-false" range={false} values={[20, 50, 80]} />
</div>
