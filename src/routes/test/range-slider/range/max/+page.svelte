<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>Single handle max-range slider</h5>
  <RangeSlider id="single-handle-max" range="max" value={70} />

  <h5>Double handle max-range slider <em>(should trim to single handle)</em></h5>
  <RangeSlider id="double-handle-max" range="max" values={[20, 60]} />

  <h5>Triple handle max-range slider with custom max <em>(should trim to single handle)</em></h5>
  <RangeSlider id="triple-handle-max" range="max" values={[20, 50, 90]} max={80} />
</div>
