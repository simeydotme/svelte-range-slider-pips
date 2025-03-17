<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<h5>Slider with invalid min/max <em>(min > max)</em></h5>
<RangeSlider min={100} max={0} />
