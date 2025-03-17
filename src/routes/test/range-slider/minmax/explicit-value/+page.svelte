<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<h5>Slider with explicit value <em>(90)</em> in range <em>(0 to 200)</em></h5>
<RangeSlider min={0} max={200} value={90} />
