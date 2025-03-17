<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>Single handle min-range slider</h5>
  <RangeSlider id="single-handle-min" range="min" value={30} />

  <h5>Double handle min-range slider <em>(should trim to single handle)</em></h5>
  <RangeSlider id="double-handle-min" range="min" values={[20, 60]} />

  <h5>Triple handle min-range slider with custom min <em>(should trim to single handle)</em></h5>
  <RangeSlider id="triple-handle-min" range="min" values={[40, 60, 70]} min={20} />
</div>
