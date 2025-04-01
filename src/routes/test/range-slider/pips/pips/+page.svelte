<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>All pips visible</h5>
  <RangeSlider id="all-pips" pips all="pip" />

  <h5>Only first and last visible</h5>
  <RangeSlider id="first-last-pips" pips first="pip" last="pip" rest={false} />

  <h5>Only rest visible</h5>
  <RangeSlider id="rest-pips" pips first={false} last={false} rest="pip" />

  <h5>Only first visible</h5>
  <RangeSlider id="first-pip" pips first="pip" last={false} rest={false} />

  <h5>Only last visible</h5>
  <RangeSlider id="last-pip" pips first={false} last="pip" rest={false} />

  <h5>First and rest visible</h5>
  <RangeSlider id="first-rest-pips" pips first="pip" last={false} rest="pip" />

  <h5>Last and rest visible</h5>
  <RangeSlider id="last-rest-pips" pips first={false} last="pip" rest="pip" />

  <h5>No pips visible (all=false)</h5>
  <RangeSlider id="no-pips" pips all={false} />

  <h5>No pips visible (first=false, last=false, rest=false)</h5>
  <RangeSlider id="no-pips-explicit" pips first={false} last={false} rest={false} />
</div>
