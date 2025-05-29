<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';

  let hasPipstep = false;
  let hasAlternatePipstep = false;

  function togglePipstep() {
    hasPipstep = !hasPipstep;
  }

  function toggleAlternatePipstep() {
    hasAlternatePipstep = !hasAlternatePipstep;
  }
</script>

<div class="slider-list">
  <h5>Very large number of pips, explicitly set</h5>
  <RangeSlider id="very-large-pips" pips first="label" last="label" max={10000} pipstep={1} />
</div>
