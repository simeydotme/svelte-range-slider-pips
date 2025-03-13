<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let value = 75;
  let values = [10, 90];
</script>

<RangeSlider {value} {values} />
