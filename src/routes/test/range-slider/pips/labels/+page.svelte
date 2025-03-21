<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>All pips with labels</h5>
  <RangeSlider pips all="label" />

  <h5>Only first and last with labels</h5>
  <RangeSlider pips first="label" last="label" rest={false} />

  <h5>Only rest with labels</h5>
  <RangeSlider pips first={false} last={false} rest="label" />

  <h5>Only first with label</h5>
  <RangeSlider pips first="label" last={false} rest={false} />

  <h5>Only last with label</h5>
  <RangeSlider pips first={false} last="label" rest={false} />

  <h5>First and rest with labels</h5>
  <RangeSlider pips first="label" last={false} rest="label" />

  <h5>Last and rest with labels</h5>
  <RangeSlider pips first={false} last="label" rest="label" />

  <h5>No labels (all=false)</h5>
  <RangeSlider pips all={false} />

  <h5>No labels (first=false, last=false, rest=false)</h5>
  <RangeSlider pips first={false} last={false} rest={false} />
</div>
