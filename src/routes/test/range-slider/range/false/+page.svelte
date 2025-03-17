<script lang="ts">
  import RangeSlider from '$components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>Single handle slider with range=false</h5>
  <RangeSlider id="single-handle-false" range={false} values={[60]} />

  <h5>Double handle slider with range=false</h5>
  <RangeSlider id="double-handle-false" range={false} values={[35, 85]} />

  <h5>Triple handle slider with range=false</h5>
  <RangeSlider id="triple-handle-false" range={false} values={[20, 50, 80]} />
</div>
