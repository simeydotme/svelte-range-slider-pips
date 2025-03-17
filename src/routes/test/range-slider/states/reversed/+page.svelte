<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>Single handle reversed slider</h5>
  <RangeSlider value={75} reversed  />

  <h5>Single handle reversed slider with custom range</h5>
  <RangeSlider value={125} reversed min={-100} max={150}  />

  <h5>Double handle reversed range slider</h5>
  <RangeSlider values={[0, 100]} range reversed  />
</div>
