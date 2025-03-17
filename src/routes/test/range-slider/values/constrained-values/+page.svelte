<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<h5>Slider with out-of-bounds values <em>(should constrain to min/max)</em></h5>
<RangeSlider values={[-20, 120]} />
