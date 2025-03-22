<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>All pips visible</h5>
  <RangeSlider pips all="pip" />

  <h5>Only first and last pips visible</h5>
  <RangeSlider pips first="pip" last="pip" rest={false} />

  <h5>Only rest pips visible</h5>
  <RangeSlider pips first={false} last={false} rest="pip" />

  <h5>Only first pip visible</h5>
  <RangeSlider pips first="pip" last={false} rest={false} />

  <h5>Only last pip visible</h5>
  <RangeSlider pips first={false} last="pip" rest={false} />

  <h5>First and rest pips visible</h5>
  <RangeSlider pips first="pip" last={false} rest="pip" />

  <h5>Last and rest pips visible</h5>
  <RangeSlider pips first={false} last="pip" rest="pip" />

  <h5>No pips visible (all=false)</h5>
  <RangeSlider pips all={false} />

  <h5>No pips visible (first=false, last=false, rest=false)</h5>
  <RangeSlider pips first={false} last={false} rest={false} />
</div>
