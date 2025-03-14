<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <RangeSlider value={75} reversed spring={false} />
  <RangeSlider value={125} reversed min={-100} max={150} spring={false} />

  <RangeSlider values={[0, 100]} range reversed spring={false} />
</div>
