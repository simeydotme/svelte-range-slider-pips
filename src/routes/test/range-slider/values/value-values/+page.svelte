<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let value = 75;
  let values = [10, 90];
</script>

<h5>Slider with both value and values props <em>(value should take precedence)</em></h5>
<RangeSlider {value} {values} />
