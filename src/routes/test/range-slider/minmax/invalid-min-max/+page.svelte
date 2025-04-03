<script lang="ts">
  import RangeSlider from '$lib/components/RangeSlider.svelte';
</script>

<h5>Slider with invalid min/max <em>(min > max)</em></h5>
<RangeSlider id="invalid-min-greater" min={100} max={0} pips first="label" last="label" />

<h5>Slider with invalid min/max <em>(max &lt; min)</em></h5>
<RangeSlider id="invalid-max-less" min={-20} max={-80} pips first="label" last="label" />

<h5>Slider with NaN min</h5>
<RangeSlider id="invalid-min-nan" min={NaN} pips first="label" last="label" />

<h5>Slider with NaN max</h5>
<RangeSlider id="invalid-max-nan" max={NaN} pips first="label" last="label" />

<h5>Slider with Infinity min</h5>
<RangeSlider id="invalid-min-infinity" min={Infinity} pips first="label" last="label" />

<h5>Slider with Infinity max</h5>
<RangeSlider id="invalid-max-infinity" max={Infinity} pips first="label" last="label" />

<h5>Slider with -Infinity min</h5>
<RangeSlider id="invalid-min-negative-infinity" min={-Infinity} pips first="label" last="label" />

<h5>Slider with -Infinity max</h5>
<RangeSlider id="invalid-max-negative-infinity" max={-Infinity} pips first="label" last="label" />
