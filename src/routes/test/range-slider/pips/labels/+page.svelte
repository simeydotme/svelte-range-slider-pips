<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<div class="slider-list">
  <h5>All pips with labels</h5>
  <RangeSlider id="all-labels" pips all="label" />

  <h5>Only first and last with labels</h5>
  <RangeSlider id="first-last-labels" pips first="label" last="label" rest={false} />

  <h5>Only rest with labels</h5>
  <RangeSlider id="rest-labels" pips first={false} last={false} rest="label" />

  <h5>Only first with label</h5>
  <RangeSlider id="first-label" pips first="label" last={false} rest={false} />

  <h5>Only last with label</h5>
  <RangeSlider id="last-label" pips first={false} last="label" rest={false} />

  <h5>First and rest with labels</h5>
  <RangeSlider id="first-rest-labels" pips first="label" last={false} rest="label" />

  <h5>Last and rest with labels</h5>
  <RangeSlider id="last-rest-labels" pips first={false} last="label" rest="label" />

  <h5>No labels (all=false)</h5>
  <RangeSlider id="no-labels" pips all={false} />

  <h5>No labels (first=false, last=false, rest=false)</h5>
  <RangeSlider id="no-labels-explicit" pips first={false} last={false} rest={false} />

  <h5>Labels with step=2.5</h5>
  <RangeSlider id="step-2-5" pips all="label" step={2.5} />

  <h5>Labels with step=7.3</h5>
  <RangeSlider id="step-7-3" pips all="label" step={7.3} />

  <h5>Labels with step=2.5 and custom min/max</h5>
  <RangeSlider id="step-2-5-minmax" pips all="label" step={2.5} min={20} max={80} />

  <h5>Labels with step=0.1</h5>
  <RangeSlider id="step-0-1" pips all="label" step={0.1} />

  <h5>Labels with max-min=1000</h5>
  <RangeSlider id="default-step-1000" pips all="label" max={1000} />

  <h5>Labels with max-min=10000</h5>
  <RangeSlider id="default-step-10000" pips all="label" max={10000} />

  <h5>Labels with max-min=100000</h5>
  <RangeSlider id="default-step-100000" pips all="label" max={100000} />
</div>
